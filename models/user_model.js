const { createHmac, randomBytes } = require("crypto");

const { Schema, model } = require("mongoose");
const { generateToken } = require("../utils/authentication");
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    profileImageUrl: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    about: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha-256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPassword;
  next();
});

// check password for login features
userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("user not found");
    const hashedPassword = user.password;
    const salt = user.salt;
    const userProvidedPassword = createHmac("sha-256", salt)
      .update(password)
      .digest("hex");
    if (hashedPassword !== userProvidedPassword)
      throw new Error("invalid credentials");

    const token = generateToken(user);
    return token;
  }
);
// check password for changng password features
userSchema.static(
  "comparePasswordAndChange",
  async function (email, oldPassword, confirmPassword) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("user not found");

    const hashedPassword = user.password;
    const salt = user.salt;
    const oldPassHash = createHmac("SHA256", salt)
      .update(oldPassword)
      .digest("hex");

    if (oldPassHash !== hashedPassword) {
      throw new Error("password didn't matched");
    }
    const passwordToBeUpdated = createHmac("SHA256", salt)
      .update(confirmPassword)
      .digest("hex");

    return passwordToBeUpdated;
  }
);

const User = model("user", userSchema);
module.exports = User;
