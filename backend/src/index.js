require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const helmet = require('helmet');
const morgan = require('morgan');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
    origin: '*', // Allow all for development flexibility with mobile
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-auth-token']
}));
app.use(express.json());

// Routes
app.use('/api/v1', require('./routes/api'));

// Info route
app.get('/api', (req, res) => {
    res.json({
        message: "Welcome to PyLearn API",
        versions: { v1: "/api/v1" }
    });
});

app.get('/', (req, res) => {
    res.send('PyLearn API is running...');
});

const { initScheduler } = require('./services/notificationScheduler');

// Error Handler (must be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        
        // Start automated push notification scheduler
        initScheduler();
    });
} else {
    // If deployed on Vercel, init scheduler (Note: setIntervals don't persist well in serverless functions)
    initScheduler();
}

// Export for Vercel Serverless Functions
module.exports = app;
