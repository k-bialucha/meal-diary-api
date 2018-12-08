const mongoose = require('mongoose');

const { Schema } = mongoose;

const MealSchema = new Schema({
  name: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
  },
  kcal: {
    type: Number,
    // default: 999,
    required: true,
  },
  tag: {
    type: String,
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
