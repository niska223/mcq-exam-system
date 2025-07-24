const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Mock login - for simplicity, we'll use static users
const mockUsers = [
  { id: '1', email: 'student1@example.com', password: 'password123', name: 'John Doe' },
  { id: '2', email: 'student2@example.com', password: 'password123', name: 'Jane Smith' },
  { id: '3', email: 'admin@example.com', password: 'admin123', name: 'Admin User' }
];

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check mock users first
    const mockUser = mockUsers.find(user => user.email === email && user.password === password);
    if (mockUser) {
      return res.json({
        success: true,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email
        }
      });
    }
    
    // If not found in mock users, check database
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check mock users first
    const mockUser = mockUsers.find(user => user.id === id);
    if (mockUser) {
      return res.json({
        success: true,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email
        }
      });
    }
    
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
