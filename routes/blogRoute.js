const express = require("express");

const blogRoute = express.Router();

require("dotenv").config();

const blogController = require("../controllers/blogController");



blogRoute.get("/", blogController.getAllBlogPosts);
blogRoute.get("/:id", blogController.getBlogPostById);
blogRoute.post("/", blogController.createBlogPost);
blogRoute.put("/:id", blogController.updateBlogPost);
blogRoute.delete("/:id", blogController.deleteBlogPost);


module.exports = { blogRoute };