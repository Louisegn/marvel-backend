const mongoose = require("mongoose");

const User = mongoose.model("User", {
  username: String,
  email: String,
  token: String,
  salt: String,
  hash: String,
  favoritesChara: Array,
  favoritesComics: Array,
});

module.exports = User;
