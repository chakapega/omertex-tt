const express = require('express');
const server = express();
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const mongoURI =
  'mongodb+srv://chakapega:chakapegaomertextt@cluster0-3yi6p.azure.mongodb.net/test?retryWrites=true&w=majority';
const PORT = 5000;
const jwtSecret = 'omertex-tt';

server.use(cors());
server.use(express.json({ extended: true }));

server.post('/signup', async (request, response) => {
  try {
    const { email, password } = request.body;
    const potentialUser = await User.findOne({ userId: email });

    if (potentialUser) {
      return response.status(400).json({ message: 'This account already exists' });
    }

    const user = new User({ userId: email, password, userIdType: 'email' });

    await user.save();
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '5m' });

    response.status(201).json({ message: 'The account was created successfully and you are logged in', token });
  } catch (error) {
    response.status(500).json({
      message: error.message || 'An error occured, please try again'
    });
  }
});

server.post('/login', async (request, response) => {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ userId: email });

    if (!user) {
      return response.status(400).json({ message: 'Account is not found' });
    }

    if (user.password !== password) {
      return response.status(400).json({ message: 'Wrong password' });
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '5m' });

    response.json({ message: 'You have successfully logged in', token });
  } catch (error) {
    response.status(500).json({
      message: error.message || 'An error occured, please try again'
    });
  }
});

server.get('/info', async (request, response) => {
  try {
    const authorizationHeader = request.headers['authorization'];
    const token = authorizationHeader && authorizationHeader.split(' ')[1];

    jwt.verify(token, jwtSecret, async (error, data) => {
      if (error) return response.status(403).json({ message: error.message });

      const { userId } = data;
      const user = await User.findById(userId);
      const updatedToken = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '5m' });

      response.json({ userId: user.userId, userIdType: user.userIdType, updatedToken });
    });
  } catch (error) {
    response.status(500).json({
      message: error.message || 'An error occured, please try again'
    });
  }
});

server.get('/latency', async (request, response) => {
  try {
    const authorizationHeader = request.headers['authorization'];
    const token = authorizationHeader && authorizationHeader.split(' ')[1];

    jwt.verify(token, jwtSecret, async (error, data) => {
      if (error) return response.status(403).json({ message: error.message });

      const { userId } = data;
      const updatedToken = jwt.sign({ userId }, jwtSecret, { expiresIn: '5m' });
      const options = {
        hostname: 'www.google.com'
      };
      const startTime = new Date();
      const latencyDefinitionRequest = http.request(options);

      latencyDefinitionRequest.end(() => {
        const endTime = new Date();
        const latency = endTime - startTime;

        response.json({ updatedToken, latency });
      });
    });
  } catch (error) {
    response.status(500).json({
      message: error.message || 'An error occured, please try again'
    });
  }
});

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.log(error));
server.listen(PORT, () => console.log(`Server has been started on port ${PORT}`));
