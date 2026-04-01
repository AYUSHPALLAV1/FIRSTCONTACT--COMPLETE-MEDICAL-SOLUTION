const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  specialization: {
    type: String,
    required: [true, 'Please add a specialization']
  },
  hospital: {
    type: String,
    required: [true, 'Please add a hospital']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  },
  fees: {
    type: Number,
    required: [true, 'Please add consultation fees']
  },
  about: {
    type: String
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4.5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  availability: {
    type: [String], // e.g., ["Mon 10:00-12:00", "Tue 14:00-16:00"]
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
