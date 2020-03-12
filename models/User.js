const { Schema, model } = require('mongoose');
const schema = new Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userIdType: { type: String, required: true }
});

module.exports = model('User', schema);
