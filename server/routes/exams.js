const express = require('express');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const router = express.Router();

// Get all exams
router.get('/', async (req, res) => {
  try {
    const exams = await Exam.find({ isActive: true });
    res.json({ success: true, exams });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get exam by ID with questions
router.get('/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    
    const questions = await Question.find({ examId: req.params.id }).sort({ questionNumber: 1 });
    
    // Remove correct answers from questions for security
    const questionsWithoutAnswers = questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      questionNumber: q.questionNumber
    }));
    
    res.json({ 
      success: true, 
      exam,
      questions: questionsWithoutAnswers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
