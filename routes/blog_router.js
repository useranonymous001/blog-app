const express = require("express");
const router = express.Router();
const BLOG = require("../models/blog_model");
const COMMENT = require("../models/comment_model");
const upload = require("../utils/multer_config");

router.get("/writeBlog", (req, res) => {
  return res.render("add_blog", {
    user: req.user,
  });
});

router.post(
  "/writeBlog/submit",
  upload.single("coverImage"),
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const blog = await BLOG.create({
        title,
        content,
        author: req.user._id,
        coverImageUrl: `/uploads/${req.file.filename}`,
      });
      return res.redirect(`/blog/view/${blog._id}`);
    } catch (error) {
      return res.render("add_blog", {
        error: `you need to logged in to create a blog`,
      });
    }
  }
);

// view all blogs from the database
router.get("/view/:blogId", async (req, res) => {
  try {
    const blogID = req.params.blogId;
    const blog = await BLOG.findById(blogID).populate("author", "-password");
    const authorsBlog = await BLOG.find({ author: blog.author });
    const comments = await COMMENT.find({ blogId: blogID }).populate(
      "createdBy",
      "-password"
    );
    return res.render("view_blog", {
      user: req.user,
      blog,
      authorsBlog,
      comments,
    });
  } catch (error) {
    return res.render("home", {
      error: `you need to logged in first`,
    });
  }
});

// view only blogs created by the logged in user
router.get("/myBlogs/:userId", async (req, res) => {
  try {
    const userID = req.params.userId;
    const blogs = await BLOG.find({ author: userID }).populate(
      "author",
      "-password"
    );

    return res.render("my_blogs", {
      user: req.user,
      blogs,
    });
  } catch (error) {
    return res.status(500).send("Internal server error ");
  }
});

router.post("/comment/:blogID", async (req, res) => {
  try {
    await COMMENT.create({
      content: req.body.content,
      blogId: req.params.blogID,
      createdBy: req.user._id,
    });
    return res.redirect(`/blog/view/${req.params.blogID}`);
  } catch (error) {
    return res.render("view_blogs", {
      error: "some error occured",
    });
  }
});

// routes for editing the post
router.get("/edit/post/:blogId", async (req, res) => {
  const blog = await BLOG.findOne({ _id: req.params.blogId });
  return res.render("edit_blog", {
    user: req.user,
    blog,
  });
});

router.post("/edit/update", upload.single("coverImage"), async (req, res) => {
  try {
    const { content, title, new_title } = req.body;

    const updatedBlog = await BLOG.findOneAndUpdate(
      // { author: req.user._id },
      { title },
      {
        title: new_title,
        content,
        coverImageUrl: `/uploads/${req.file.filename}`,
      }
    );
    return res.redirect(`/blog/view/${updatedBlog._id}`);
  } catch (error) {
    return res.render("edit_blog", {
      error: `Please, fill all the fields properly`,
    });
  }
});

// routes for deleting the post
router.get("/post/delete/:blogId", async (req, res) => {
  try {
    const blogID = req.params.blogId;
    const blog = await BLOG.findOneAndDelete({ _id: blogID });
    return res.redirect(`/blog/myBlogs/${blog.author}`);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
