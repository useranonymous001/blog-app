const express = require("express");
const router = express.Router();
const USER = require("../models/user_model");

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

router.post("/signin", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    await USER.create({
      fullName,
      email,
      password,
    });

    return res.redirect("/user/login");
  } catch (error) {
    return res.render("signin", {
      error: "All fields are required",
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await USER.matchPasswordAndGenerateToken(email, password);
    res.cookie("token", token);
    return res.redirect("/home");
  } catch (error) {
    return res.render("login", {
      error: "invalid email or password",
    });
  }
});
// user profile settings

router.get("/profile", (req, res) => {
  res.json({ message: "this is user profile section" });
  // render everything here:
  // profile/changePassword
  // profile/about
});

router.post("/profile/changePassword", async (req, res) => {
  const { oldPassword, newPassword, confirmPassword, email } = req.body;
  if (newPassword !== confirmPassword)
    return res.json({ message: "new and confirm password didn;t matched" });
  try {
    const passwordToBeUpdated = await USER.comparePasswordAndChange(
      email,
      oldPassword,
      confirmPassword
    );

    const user = await USER.findOneAndUpdate(
      { email },
      { password: passwordToBeUpdated }
    );
    return res.json({ message: "password changed successfully" });
  } catch (error) {
    return res.json({ message: `some error occured, ${error.message}` });
  }
});

router.post("/profile/about", async (req, res) => {
  try {
    const { email, about } = req.body;
    const user = await USER.findOneAndUpdate({ email }, { about }); // change to req.user.email afterwards
    return res.json({ About: `${about}` });
  } catch (error) {
    return res.json({ message: `some error occured, ${error.message}` });
  }
});

router.get("/logout", (req, res) => {
  // res.cookie("token", "");
  res.clearCookie("token").redirect("/home");
});

module.exports = router;
