const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  dm: Boolean,
  admin: Boolean,
  accountcreated: {
    type: Date,
    default: Date.now()
  },
  charactername: String,
  characterlvl: {
    type: Number,
    min: 1,
    max: 20,
  },
  characterclass: String,
  characterrace: String
});
const User = (module.exports = mongoose.model("player", userSchema, "Users"));
