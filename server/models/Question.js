const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }],
  correctOption: {
    type: String,
    required: true
  },
  questionNumber: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
