const url = require('url');
const Meal = require('../models/Meal');

/**
 * GET /meals
 * getting a list of meals
 * can be filtered by userId
 */
exports.getMeals = (req, res) => {
  const urlParts = url.parse(req.url, true);
  const userId = urlParts.query.id;
  let query = {};

  if (userId) { query = { userId }; }

  Meal.find(query, (err, meal) => {
    if (err) {
      if (err.path === 'userId') { res.status(404); } else { res.status(400); }
      res.send(err);
    }
    res.json(meal);
  });
};

/**
 * GET /meals/:id
 * get specific meal
 */
exports.getMealById = (req, res) => {
  const { id } = req.params;

  const query = { _id: id };

  Meal.find(query, (err, meal) => {
    if (err) {
      res.status(404);
      res.send(err);
    }
    res.json(meal);
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
