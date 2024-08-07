const express = require("express");
const router = express.Router();
const BLOG = require("../models/blog_model");
const COMMENT = require("../models/comment_model");
const upload = require("../utils/multer_config");

// requiring all the controllers
const {
  handleCreateAndUploadBlog,
  handleViewAllBlogs,
  handleViewPersonalBlogCreated,
  handleUserComments,
  getEditPostPage,
  handleUpdateBlogFromUser,
  handleDeletePostFromUser,
} = require("../controllers/blog_control");

router.get("/writeBlog", (req, res) => {
  return res.render("add_blog", {
    user: req.user,
  });
});

router.post(
  "/writeBlog/submit",
  upload.single("coverImage"),
  handleCreateAndUploadBlog
);

// view all blogs from the database
router.get("/view/:blogId", handleViewAllBlogs);

// view only blogs created by the logged in user
router.get("/myBlogs/:userId", handleViewPersonalBlogCreated);

router.post("/comment/:blogID", handleUserComments);

// routes for editing the post
router.get("/edit/post/:blogId", getEditPostPage);

router.post(
  "/edit/update",
  upload.single("coverImage"),
  handleUpdateBlogFromUser
);

// routes for deleting the post
router.get("/post/delete/:blogId", handleDeletePostFromUser);

module.exports = router;
