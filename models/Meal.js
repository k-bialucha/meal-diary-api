const mongoose = require('mongoose');

const { Schema } = mongoose;

const MealSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  kcal: {
    type: Number,
    required: true,
  },
  tag: {
    type: String,
  },
  photo: {
    type: String,
    default: 'X'
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
});

const Meal = mongoose.model('Meal', MealSchema);

module.exports = Meal;
