const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user');

const itemSchema = new Schema({
  title: String,
  description: String,
  type: String,
  keywords: [String],
  images: [Schema.Types.Mixed],
  approxAge: Number,
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
});


const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
