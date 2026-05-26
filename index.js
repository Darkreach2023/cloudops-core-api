const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());  
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Core API is running on port ${PORT}`);
});
