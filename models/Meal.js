const mongoose = require('mongoose');

const { Schema } = mongoose;

const MealSchema = new Schema({
  name: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
  },
  photo: {
    type: String,
    default: 'X'
  },
  created: {
    type: Date,
    default: Date.now
  },
});

const Meal = mongoose.model('Meal', MealSchema);

module.exports = Meal;
