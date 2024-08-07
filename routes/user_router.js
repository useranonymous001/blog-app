const express = require("express");
const router = express.Router();
const USER = require("../models/user_model");
const BLOG = require("../models/blog_model");

// require all the controllers
const {
  handleRegisterNewUser,
  handleLoginUser,
  handleChangeUserPassword,
  handleAddUserDescription,
  handleGetProfilePage,
} = require("../controllers/user_control");

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

// user profile settings
router.get("/profile/change-password", (req, res) => {
  return res.render("change-password", {
    user: req.user,
  });
});

router.get("/profile/addDescription", (req, res) => {
  return res.render("add-description", {
    user: req.user,
  });
});

router.get("/logout", (req, res) => {
  // res.cookie("token", "");
  res.clearCookie("token").redirect("/home");
});

router.get("/profile", handleGetProfilePage);

// post requests routes
router.post("/profile/change-password", handleChangeUserPassword);

router.post("/signin", handleRegisterNewUser);

router.post("/login", handleLoginUser);

router.post("/profile/about", handleAddUserDescription);

module.exports = router;
