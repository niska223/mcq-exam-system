const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Exam = require('./models/Exam');
const Question = require('./models/Question');

dotenv.config();

const sampleData = [
  {
    exam: {
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of JavaScript basics including variables, functions, and objects.",
      duration: 30,
      totalQuestions: 5
    },
    questions: [
      {
        questionText: "What is the correct way to declare a variable in JavaScript?",
        options: [
          { text: "var myVar = 10;", value: "A" },
          { text: "variable myVar = 10;", value: "B" },
          { text: "v myVar = 10;", value: "C" },
          { text: "declare myVar = 10;", value: "D" }
        ],
        correctOption: "A",
        questionNumber: 1
      },
      {
        questionText: "Which of the following is NOT a JavaScript data type?",
        options: [
          { text: "String", value: "A" },
          { text: "Boolean", value: "B" },
          { text: "Float", value: "C" },
          { text: "Number", value: "D" }
        ],
        correctOption: "C",
        questionNumber: 2
      },
      {
        questionText: "What does '===' operator do in JavaScript?",
        options: [
          { text: "Compares values only", value: "A" },
          { text: "Compares types only", value: "B" },
          { text: "Compares both value and type", value: "C" },
          { text: "Assignment operator", value: "D" }
        ],
        correctOption: "C",
        questionNumber: 3
      },
      {
        questionText: "How do you create a function in JavaScript?",
        options: [
          { text: "function myFunction() {}", value: "A" },
          { text: "create myFunction() {}", value: "B" },
          { text: "function = myFunction() {}", value: "C" },
          { text: "def myFunction() {}", value: "D" }
        ],
        correctOption: "A",
        questionNumber: 4
      },
      {
        questionText: "What will 'typeof null' return in JavaScript?",
        options: [
          { text: "null", value: "A" },
          { text: "undefined", value: "B" },
          { text: "object", value: "C" },
          { text: "string", value: "D" }
        ],
        correctOption: "C",
        questionNumber: 5
      }
    ]
  },
  {
    exam: {
      title: "React Basics",
      description: "Test your understanding of React components, state, and props.",
      duration: 25,
      totalQuestions: 5
    },
    questions: [
      {
        questionText: "What is JSX in React?",
        options: [
          { text: "A JavaScript library", value: "A" },
          { text: "A syntax extension for JavaScript", value: "B" },
          { text: "A CSS framework", value: "C" },
          { text: "A database", value: "D" }
        ],
        correctOption: "B",
        questionNumber: 1
      },
      {
        questionText: "How do you pass data from parent to child component in React?",
        options: [
          { text: "Using state", value: "A" },
          { text: "Using props", value: "B" },
          { text: "Using context", value: "C" },
          { text: "Using refs", value: "D" }
        ],
        correctOption: "B",
        questionNumber: 2
      },
      {
        questionText: "What hook is used to manage state in functional components?",
        options: [
          { text: "useEffect", value: "A" },
          { text: "useState", value: "B" },
          { text: "useContext", value: "C" },
          { text: "useReducer", value: "D" }
        ],
        correctOption: "B",
        questionNumber: 3
      },
      {
        questionText: "What is the virtual DOM in React?",
        options: [
          { text: "A real DOM element", value: "A" },
          { text: "A JavaScript representation of the real DOM", value: "B" },
          { text: "A CSS framework", value: "C" },
          { text: "A database", value: "D" }
        ],
        correctOption: "B",
        questionNumber: 4
      },
      {
        questionText: "Which method is called when a component is first created?",
        options: [
          { text: "componentDidUpdate", value: "A" },
          { text: "componentWillUnmount", value: "B" },
          { text: "componentDidMount", value: "C" },
          { text: "componentWillMount", value: "D" }
        ],
        correctOption: "C",
        questionNumber: 5
      }
    ]
  },
  {
    exam: {
      title: "Node.js Backend Development",
      description: "Test your knowledge of Node.js, Express, and backend development concepts.",
      duration: 30,
      totalQuestions: 5
    },
    questions: [
      {
        questionText: "What is Node.js?",
        options: [
          { text: "A JavaScript framework", value: "A" },
          { text: "A JavaScript runtime built on Chrome's V8 engine", value: "B" },
          { text: "A database", value: "C" },
          { text: "A CSS preprocessor", value: "D" }
        ],
        correctOption: "B",
        questionNumber: 1
      },
      {
        questionText: "Which command is used to initialize a new Node.js project?",
        options: [
          { text: "node init", value: "A" },
          { text: "npm init", value: "B" },
          { text: "node start", value: "C" },
          { text: "npm start", value: "D" }
        ],
        correctOption: "B",
        questionNumber: 2
      },
      {
        questionText: "What is Express.js?",
        options: [
          { text: "A database", value: "A" },
          { text: "A web application framework for Node.js", value: "B" },
          { text: "A front-end library", value: "C" },
          { text: "A testing framework", value: "D" }
        ],
        correctOption: "B",
        questionNumber: 3
      },
      {
        questionText: "How do you handle asynchronous operations in Node.js?",
        options: [
          { text: "Using callbacks only", value: "A" },
          { text: "Using promises and async/await", value: "B" },
          { text: "Using synchronous code only", value: "C" },
          { text: "Using loops", value: "D" }
        ],
        correctOption: "B",
        questionNumber: 4
      },
      {
        questionText: "What is middleware in Express.js?",
        options: [
          { text: "A database connection", value: "A" },
          { text: "Functions that execute during the request-response cycle", value: "B" },
          { text: "A front-end component", value: "C" },
          { text: "A CSS framework", value: "D" }
        ],
        correctOption: "B",
        questionNumber: 5
      }
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas successfully!');
    console.log('Database name:', mongoose.connection.name);

    // Clear existing data
    await Exam.deleteMany({});
    await Question.deleteMany({});
    console.log('Cleared existing data');

    // Seed data
    for (const data of sampleData) {
      // Create exam
      const exam = new Exam(data.exam);
      await exam.save();
      console.log(`Created exam: ${exam.title}`);

      // Create questions for this exam
      for (const questionData of data.questions) {
        const question = new Question({
          ...questionData,
          examId: exam._id
        });
        await question.save();
      }
      console.log(`Created ${data.questions.length} questions for ${exam.title}`);
    }

    console.log('Database seeded successfully!');
    console.log('You can now start the server and begin using the MCQ system');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

seedDatabase();
