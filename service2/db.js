const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const OrderSchema = new mongoose.Schema({
  userId: Number,
  name: String,
  email: String,
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
