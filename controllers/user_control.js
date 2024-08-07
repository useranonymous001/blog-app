const express = require("express");
const USER = require("../models/user_model");
const BLOG = require("../models/blog_model");

// post request handlers
async function handleRegisterNewUser(req, res) {
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
}

async function handleLoginUser(req, res) {
  try {
    const { email, password } = req.body;
    const token = await USER.matchPasswordAndGenerateToken(email, password);
    res.cookie("token", token);
    return res.redirect("/home");
  } catch (error) {
    return res.render("login", {
      error: "invalid email or password",
    });
  }
}

async function handleChangeUserPassword(req, res) {
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
    return res.render("change-password", {
      user: req.user,
      success: "password changed successfully",
    });
  } catch (error) {
    return res.json({ message: `Some error occured...!!` });
  }
}

async function handleAddUserDescription(req, res) {
  try {
    const { about } = req.body;
    const user = await USER.findOneAndUpdate(
      { email: req.user.email },
      { about }
    ); // change to req.user.email afterwards
    return res.redirect("/user/profile");
  } catch (error) {
    return res.json({ message: `some error occured, ${error.message}` });
  }
}

// get request handlers
async function handleGetProfilePage(req, res) {
  try {
    const user = await USER.findOne({ email: req.user.email }).select(
      "-password"
    );
    const blogs = await BLOG.find({ author: req.user._id });
    return res.render("profile", {
      user,
      blogs,
    });
  } catch (error) {
    return res.status(401).send("401 Unauthorized");
  }
}

module.exports = {
  handleRegisterNewUser,
  handleLoginUser,
  handleChangeUserPassword,
  handleAddUserDescription,
  handleGetProfilePage,
};
