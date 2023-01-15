const express = require("express");

const blogRoute = express.Router();

require("dotenv").config();

const blogController = require("../controllers/blogController");

const catchAsyncFn = require("../utils/catchAsyncFunc");

///N.B: REMEMBER THAT CATCHASYNCFN CAN ONLY BE USED FOR ASYNC. FUNCTIONS NOT SYNC. FUNCTIONS.
blogRoute.get("/", catchAsyncFn(blogController.getAllBlogPosts));
blogRoute.get("/:id", catchAsyncFn(blogController.getBlogPostById));
blogRoute.get("/getThePosts/userBlogPosts", catchAsyncFn(blogController.getUsersBlogPosts));
blogRoute.post("/", catchAsyncFn(blogController.createBlogPost));
blogRoute.patch("/:id", catchAsyncFn(blogController.updateBlogPost));
blogRoute.delete("/:id", catchAsyncFn(blogController.deleteBlogPost));


module.exports = blogRoute ;