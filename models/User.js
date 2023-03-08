const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: String,
  chatId: String,
  name: String,
  status: {
    type: String,
    enum: ["none", "creating"],
    default: "none",
  },
});

module.exports = mongoose.model("User", userSchema);
