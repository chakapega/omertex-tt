const express = require('express');
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const mongoURI =
  'mongodb+srv://chakapega:chakapegaomertextt@cluster0-3yi6p.azure.mongodb.net/test?retryWrites=true&w=majority';
const PORT = 5000;

server.use(cors());
server.use(express.json({ extended: true }));

server.post('/signup', async (request, response) => {
  try {
    const { email, password } = request.body;
    const potentialUser = await User.findOne({ email });

    if (potentialUser) {
      return response.status(400).json({ message: 'This user already exists' });
    }

    const user = new User({ email, password, userIdType: 'email' });

    await user.save();
    response.status(201).json({ message: 'User created' });
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
