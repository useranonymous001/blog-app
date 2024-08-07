require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT;
const { checkForAuthentication } = require("./middlewares/auth");

const { connectMongoDb } = require("./controllers/mongodb_connection");
const userRoute = require("./routes/user_router");
const blogRoute = require("./routes/blog_router");

// public static file
app.use(express.static(path.resolve("./public")));

// requiring all the blog from the database
const BLOG = require("./models/blog_model");

// function to connect to the mongoDB
connectMongoDb("mongodb://localhost:27017/blogHub")
  .then(() => {
    console.log("mongoDB connected successfully");
  })
  .catch((error) => {
    console.log("error", error);
  });

// middlewares for checking authentication
app.use(cookieParser());
app.use(checkForAuthentication);

// middlewares for rendering template engines
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// middlewares for handling form data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.json());

// all the router from the router

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get("/home", async (req, res) => {
  const allBlog = await BLOG.find().populate("author").select("-password");
  res.render("home", {
    user: req.user,
    blogs: allBlog,
  });
});

app.get("/about-us", (req, res) => {
  return res.render("about-us", {
    user: req.user,
  });
});

app.listen(PORT, (err) => {
  console.log(err ? err.message : `server started at port ${PORT}`);
});
