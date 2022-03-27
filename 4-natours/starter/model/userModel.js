const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'You must have an Email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'You must have a Password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      // this only works for CREATE and SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: "Password didn't match",
    },
  },
});

// Encrypt the password
userSchema.pre('save', async function (next) {
  // if no changes in password, it should return
  if (!this.isModified('password')) return next();

  // Encrypt the password
  this.password = await bcrypt.hash(this.password, 12);

  // To remove the passwordConfirm from the database
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
