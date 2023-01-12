const express = require("express");

const blogRoute = express.Router();

require("dotenv").config();

const blogController = require("../controllers/blogController");



blogRoute.get("/", blogController.getAllBlogPosts);
blogRoute.get("/:id", blogController.getBlogPostById);
blogRoute.get("/getThePosts/userBlogPosts", blogController.getUsersBlogPosts);
blogRoute.post("/", blogController.createBlogPost);
blogRoute.patch("/:id", blogController.updateBlogPost);
blogRoute.delete("/:id", blogController.deleteBlogPost);


module.exports = { blogRoute };