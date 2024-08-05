const JWT = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_SECRET_KEY;

function generateToken(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };

  const token = JWT.sign(payload, JWT_KEY); // can also add some expiry time for the token
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, JWT_KEY);
  return payload;
}

module.exports = {
  generateToken,
  validateToken,
};
