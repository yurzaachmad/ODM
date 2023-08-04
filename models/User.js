const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.pre("save", function (next) {
  if (!this.created) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
  }
  next();
});

// Equivalent to calling `pre()` on `updateOne`, `findOneAndUpdate`.
userSchema.pre(["updateOne", "findOneAndUpdate"], function (next) {
  if (!this.created || this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
  }
  next();
});

userSchema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
