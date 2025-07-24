const express = require('express');
const Result = require('../models/Result');
const Question = require('../models/Question');
const Exam = require('../models/Exam');
const router = express.Router();

// Submit exam answers and calculate result
router.post('/submit', async (req, res) => {
  try {
    console.log('=== SUBMIT REQUEST RECEIVED ===');
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', req.headers);
    
    const { userId, examId, answers, timeTaken } = req.body;
    
    console.log('Extracted values:');
    console.log('- userId:', userId, '(type:', typeof userId, ')');
    console.log('- examId:', examId, '(type:', typeof examId, ')');
    console.log('- answers:', answers, '(type:', typeof answers, ', length:', answers?.length, ')');
    console.log('- timeTaken:', timeTaken, '(type:', typeof timeTaken, ')');
    
    // Validate required fields
    if (!userId || !examId || !answers || timeTaken === undefined) {
      console.log('❌ VALIDATION FAILED - Missing required fields');
      console.log('Missing fields check:', { 
        userId: !userId, 
        examId: !examId, 
        answers: !answers, 
        timeTaken: timeTaken === undefined 
      });
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields',
        details: {
          userId: userId ? 'provided' : 'missing',
          examId: examId ? 'provided' : 'missing',
          answers: answers ? `provided (${answers.length} items)` : 'missing',
          timeTaken: timeTaken !== undefined ? 'provided' : 'missing'
        }
      });
    }
    
    console.log('✅ All required fields present');
    
    // Get all questions for this exam
    const questions = await Question.find({ examId });
    const exam = await Exam.findById(examId);
    
    console.log('Found questions:', questions.length);
    console.log('Found exam:', !!exam);
    
    if (!exam) {
      console.log('❌ Exam not found for ID:', examId);
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    
    let score = 0;
    const resultAnswers = [];
    
    // Check each answer
    for (const answer of answers) {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      if (question) {
        const isCorrect = question.correctOption === answer.selectedOption;
        if (isCorrect) score++;
        
        resultAnswers.push({
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          isCorrect
        });
      }
    }
    
    const percentage = (score / questions.length) * 100;
    
    console.log('Calculated results:', { score, totalQuestions: questions.length, percentage });
    
    // Save result
    const result = new Result({
      userId,
      examId,
      score,
      totalQuestions: questions.length,
      percentage,
      timeTaken,
      answers: resultAnswers
    });
    
    console.log('Saving result to database...');
    await result.save();
    console.log('Result saved successfully:', result._id);
    
    res.json({
      success: true,
      result: {
        id: result._id,
        score,
        totalQuestions: questions.length,
        percentage: Math.round(percentage * 100) / 100,
        timeTaken
      }
    });
  } catch (error) {
    console.error('Submit result error:', error);
    console.error('Error stack:', error.stack);
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error: ' + error.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
});

// Get result by ID with detailed answers
router.get('/:id', async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('examId', 'title description');
    
    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }
    
    // Get questions with correct answers for result display
    const questions = await Question.find({ examId: result.examId._id });
    
    const detailedAnswers = result.answers.map(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId.toString());
      return {
        questionId: answer.questionId,
        questionText: question ? question.questionText : 'Question not found',
        options: question ? question.options : [],
        selectedOption: answer.selectedOption,
        correctOption: question ? question.correctOption : '',
        isCorrect: answer.isCorrect
      };
    });
    
    res.json({
      success: true,
      result: {
        ...result.toObject(),
        detailedAnswers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user's exam history
router.get('/user/:userId', async (req, res) => {
  try {
    const results = await Result.find({ userId: req.params.userId })
      .populate('examId', 'title description')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
