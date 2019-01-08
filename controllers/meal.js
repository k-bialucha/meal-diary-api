const url = require('url');
const moment = require('moment');

const Meal = require('../models/Meal');

/**
 * GET /meals
 * getting a list of meals
 * can be filtered by date
 */
exports.getMeals = (req, res) => {
  const userId = req.user._id;
  const urlParts = url.parse(req.url, true);

  const { date } = urlParts.query;
  const momentDate = moment(date, 'DD-MM-YYYY');

  let query = { userId };
  if (date) {
    query = {
      ...query,
      date: {
        $gte: momentDate.toDate(),
        $lte: moment(momentDate).endOf('day').toDate()
      }
    };
  }

  Meal.find(query, (err, meals) => {
    if (err) {
      if (err.path === 'userId') { res.status(404); } else { res.status(400); }
      res.send(err);
    } else {
      res.json(meals);
    }

    // const mealsWithDate = meals.map((meal) => {
    //   const newDate = moment(meal.date).format('DD-MM-YYYY HH:mm');
    //   return {
    //     _id: meal._id,
    //     userId: meal.userId,
    //     type: meal.type,
    //     name: meal.name,
    //     photo: meal.photo,
    //     kcal: meal.kcal,
    //     date: newDate
    //   };
    // });
  });
};

/**
 * GET /meals/:id
 * get specific meal
 */
exports.getMealById = (req, res) => {
  const { id } = req.params;

  const query = { _id: id };

  Meal.findOne(query, (err, meal) => {
    if (err) {
      res.status(400);
      res.send(err);
    } else if (!meal) {
      res.status(404);
      res.send({ error: 'not found' });
    } else {
      res.json(meal);
    }
  });
};

/**
 * GET /meals/tags
 * get available tags
 */
exports.getMealTags = (req, res) => {
  Meal.distinct('tag', {}, (err, tags) => {
    if (err) {
      res.status(400);
      res.send(err);
    }
    tags.sort();
    res.json(tags);
  });
};

/**
 * POST /meals
 * Sending a new meal
 */
exports.postMeals = (req, res) => {
  const meal = new Meal(req.body);
  meal.save((err, meal) => {
    if (err) { res.send(err); }
    res.json(meal);
  });
};

/**
 * DELETE /meals/:id
 * Delete existing meal
 */
exports.deleteMeal = (req, res) => {
  const { id } = req.params;

  Meal.findByIdAndRemove(id, (err) => {
    if (err) {
      res.status(400);
      res.send(err);
    } else {
      res.status(204);
      res.send();
    }
  });
};


/**
 * GET /kcal
 * get sum of kcal
 */
exports.getKcal = (req, res) => {
  const urlParts = url.parse(req.url, true);
  const { userId } = urlParts.query;
  const { date } = urlParts.query;
  const momentDate = moment(date, 'DD-MM-YYYY');

  let query = {};
  if (userId) { query = { ...query, userId }; }
  if (date) {
    query = {
      ...query,
      date: {
        $gte: momentDate.toDate(),
        $lte: moment(momentDate).endOf('day').toDate()
      }
    };
  }

  Meal.find(query, (err, meals) => {
    if (err) {
      res.status(400);
      res.send(err);
    }

    let kcalSum = 0;
    meals.forEach((meal) => {
      kcalSum += meal.kcal;
    });

    res.status(200);
    res.json(JSON.parse(kcalSum));
  });
};
