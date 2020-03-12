const express = require('express');
const server = express();
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

    response
      .status(201)
      .json({ message: 'The account was created successfully and you are logged in', token, userId: user.id });
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

    response.json({ message: 'You have successfully logged in', token, userId: user.id });
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
