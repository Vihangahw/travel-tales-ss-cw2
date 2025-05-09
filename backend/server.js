const express = require('express');
const cors = require('cors');
const app = express();
const serverPort = 4000;
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);

app.get('/', (request, response) => {
  response.send('Welcome to TravelTales!');
});

app.listen(serverPort, () => {
  console.log(`Server running at http://localhost:${serverPort}`);
});