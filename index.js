const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
   origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
     callback(new Error('Not allowed by CORS'));
  }
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


// Define your API routes here
app.get('/health', (req, res) => {
  res.json({ message: 'Health check passed!' });
});

app.get('/status', (req, res) => {
  res.json({ service: 'core-api', status: 'running' });

});

app.post('/test', (req, res) => {
  res.json({ 
    message: "test recibido",
    data: req.body });
});

app.get('/users-summary', async (req, res) => {
  const usersApiUrl = process.env.USERS_API_URL || 'http://localhost:3001';

  try {
    const response = await fetch(`${usersApiUrl}/users`);

    if (!response.ok) {
      return res.status(502).json({
        service: 'core-api',
        message: 'Failed to fetch users from users-api'
      });
    }

    const usersData = await response.json();

    res.json({
      service: 'core-api',
      source: 'users-api',
      usersCount: usersData.count,
      users: usersData.data
    });
  } catch (error) {
    console.error('Error connecting to users-api:', error);

    res.status(500).json({
      service: 'core-api',
      message: 'Error connecting to users-api'
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Core API is running on port ${PORT}`);
});
