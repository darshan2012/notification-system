const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { register, login,updateSettings } = require('./controllers/userController');
const { initializeJobs } = require('./utils/scheduleEmailJobs');
require('dotenv').config();
const app = express();

mongoose.connect('mongodb://localhost:27017/notifications', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use(express.json());

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send({ message: 'Invalid token' });
    }
};

app.post('/register', register);
app.post('/login', login);
app.put('/settings', authenticate, updateSettings);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    initializeJobs();
});
