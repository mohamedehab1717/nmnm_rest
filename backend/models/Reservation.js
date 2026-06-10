const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional if guest reservation allowed
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  date: {
    type: String, // e.g. YYYY-MM-DD
    required: [true, 'Please select a date'],
  },
  time: {
    type: String, // e.g. HH:MM
    required: [true, 'Please select a time'],
  },
  guestsCount: {
    type: Number,
    required: [true, 'Please specify the number of guests'],
    min: 1,
  },
  specialRequests: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Reservation', reservationSchema);
