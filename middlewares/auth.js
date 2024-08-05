const { validateToken } = require("../utils/authentication");

function checkForAuthentication(req, res, next) {
  const token = req.cookies.token;
  if (!token) return next();
  try {
    const user = validateToken(token);
    req.user = user;
    return next();
  } catch (error) {
    res.json({ message: `some error occured, ${error.message}` });
  }
}

function checkForAuthorization(req, res, next) {
  try {
    if (req.user._id !== req.params.userId) {
      return res.json({ message: `401 unauthorized` });
    }
    return next();
  } catch (error) {
    res.json({ message: `some error occured, ${error.message}` });
  }
}

module.exports = {
  checkForAuthentication,
  checkForAuthorization,
};
