# MCQ Exam System

A simple Online MCQ (Multiple Choice Questions) Exam System built with React (frontend) and Node.js with Express (backend), using MongoDB Atlas as the database.

## Features

- **User Authentication**: Mock login system with predefined users
- **Exam Management**: View available mock exam papers
- **MCQ Exam Attempt**: Take exams with multiple choice questions
- **Timer**: Real-time countdown timer for exams
- **Result Display**: View scores, grades, and detailed answer review
- **Exam History**: Track past exam attempts and results

## Technology Stack

- **Frontend**: React, React Router DOM, Axios
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB Atlas
- **Styling**: CSS3 with responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/niska223/mcq-exam-system.git
cd mcq-exam-system
```

### 2. Backend Setup

#### Navigate to server directory:
```bash
cd server
```

#### Install dependencies:
```bash
npm install
```

#### Configure Environment Variables:
1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster and get your connection string
3. Update the `.env` file with your MongoDB Atlas credentials:

```env
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/mcq-system?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

#### Seed the Database:
```bash
npm run seed
```

#### Start the Backend Server:
```bash
npm run dev
```

The server will run on http://localhost:5000

### 3. Frontend Setup

#### Open a new terminal and navigate to client directory:
```bash
cd client
```

#### Install dependencies:
```bash
npm install
```

#### Start the React Application:
```bash
npm start
```

The frontend will run on http://localhost:3000

## Demo Credentials

The system includes predefined mock users for testing:

| Email | Password | Role |
|-------|----------|------|
| student1@example.com | password123 | Student |
| student2@example.com | password123 | Student |
| admin@example.com | admin123 | Admin |

**Quick Test:** Login with `student1@example.com` / `password123` to access the system immediately.

## Screenshots

The system provides:
- 📱 Responsive login interface
- 📊 Dashboard with available exams
- ⏱️ Real-time exam timer with warnings
- 📈 Detailed results with answer review
- 📚 Exam history tracking

## System Features

### 1. Login System
- Mock authentication with predefined users
- Secure session management
- Automatic redirect to dashboard after login

### 2. Dashboard
- View available mock exam papers
- Access exam history
- User profile information

### 3. Exam Taking
- Real-time timer with visual warnings
- Question navigation (next/previous)
- Question overview panel showing answered/unanswered questions
- Answer selection and modification
- Exam submission with confirmation

### 4. Results
- Immediate score display with percentage and grade
- Detailed answer review showing:
  - Correct/incorrect answers
  - Selected vs. correct options
  - Question-wise breakdown
- Historical results tracking

## Database Schema

### Users
- ID, name, email, password

### Exams
- ID, title, description, duration, totalQuestions, isActive

### Questions
- ID, examId, questionText, options, correctOption, questionNumber

### Results
- ID, userId, examId, score, totalQuestions, percentage, timeTaken, answers

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile/:id` - Get user profile

### Exams
- `GET /api/exams` - Get all active exams
- `GET /api/exams/:id` - Get exam with questions

### Results
- `POST /api/results/submit` - Submit exam answers
- `GET /api/results/:id` - Get result details
- `GET /api/results/user/:userId` - Get user's exam history

## Project Structure

```
mcq-system/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context for auth
│   │   ├── services/       # API service functions
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── server.js          # Main server file
│   ├── seed.js            # Database seeding script
│   └── package.json
└── README.md
```

## Sample Exam Data

The system comes with 3 pre-configured mock exams:

1. **JavaScript Fundamentals** - 5 questions on JS basics
2. **React Basics** - 5 questions on React concepts
3. **Node.js Backend Development** - 5 questions on Node.js and Express

Each exam contains 5 multiple-choice questions with a 25-30 minute time limit.

## Development Notes

- The frontend runs on port 3000
- The backend runs on port 5000
- CORS is configured to allow frontend-backend communication
- MongoDB Atlas is used for cloud database hosting
- The system uses mock authentication for simplicity
- Timer warnings appear at 10 minutes (yellow) and 5 minutes (red) remaining

## Future Enhancements

- Real user registration and authentication
- Admin panel for exam management
- Question bank management
- Exam scheduling
- Advanced analytics and reporting
- Export results to PDF
- Multi-language support

## Troubleshooting

1. **MongoDB Connection Issues**: Ensure your IP address is whitelisted in MongoDB Atlas
2. **CORS Errors**: Make sure both frontend and backend are running on correct ports
3. **Seeding Errors**: Ensure MongoDB connection is working before running seed script
4. **Timer Issues**: Check browser console for JavaScript errors

## Support

For any issues or questions, please check the console logs in both browser and server terminal for detailed error messages.
