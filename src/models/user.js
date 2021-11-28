const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { passProperties } = require("../../public/config/models-config");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(value) {
        if (value.length < 7) {
          throw new Error("Username should be at least 7 characters long!");
        }
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("This is not an email!");
        }
      },
    },
    dateOfBirth: {
      type: Date,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value, passProperties)) {
          throw new Error("Password is not secure enough!");
        }
      },
    },
    userPhoto: {
      type: Buffer,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// VIRTUAL FIELDS SETUP which related to User collection 
userSchema.virtual('assets', {
  ref: 'Assets',
  localField: '_id',
  foreignField: 'owner'
});

// STATIC METHODS (NO NEW OBJECT REQUIRED)
userSchema.statics.findByCredentials = async (username, email, password) => {
  const user = await User.findOne({ $or: [{ email }, { username }] });
  console.log('asdas2d');
  if (!user) {
    throw new Error("Unable to login!");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login!");
  }

  return user;
};

// METHODS REQUIRED TO USE OBJECT OF USER
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({
    token,
  });

  await user.save();

  return token;
};

// DEFINES WHAT DATA WILL BE RETURNED DURING FIND METADATA
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.userPhoto;
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};


// TRIGGER BEFORE SAVE
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});


// EXPORT Model
const User = mongoose.model("User", userSchema);

module.exports = User;
