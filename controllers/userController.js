const User = require('../models/userModel');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { scheduleJob } = require('../utils/scheduleEmailJobs');
const cronJobs = require('../utils/cronJobs');
const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error registering user', error });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send({ message: 'User not found' });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).send({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).send({ message: 'Error logging in', error });
    }
};





const updateSettings = async (req, res) => {
    const { frequency, time } = req.body;
    try {
        const userId = req.user.userId;  // Assuming user ID is available in the request object
        await User.findByIdAndUpdate(userId, { 'notificationSettings.frequency': frequency, 'notificationSettings.time': time });
        
        // Reschedule the job
        if (cronJobs[userId]) {
            cronJobs[userId].stop();  // Stop the existing job
        }
        cronJobs[userId] = scheduleJob(userId, frequency, time);  // Schedule a new job

        res.status(200).send({ message: 'Notification settings updated successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error updating settings', error });
    }
};


module.exports = { register, login, updateSettings };
