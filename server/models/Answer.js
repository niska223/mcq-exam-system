const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  examId: {
    type: String,
    required: true
  },
  questionId: {
    type: String,
    required: true
  },
  selectedOption: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  correctOption: {
    type: String,
    required: true
  }
}, { 
  timestamps: true,
  collection: 'answer' // This explicitly sets the collection name to 'answer'
});

module.exports = mongoose.model('Answer', answerSchema);
