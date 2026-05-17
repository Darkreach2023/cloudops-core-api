const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
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

app.listen(PORT, () => {
  console.log(`Core API is running on port ${PORT}`);
});
