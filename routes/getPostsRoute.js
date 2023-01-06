const express = require("express");
const getPostsRoute = express.Router();
const moment = require("moment");

const getBlogPosts = require("../controllers/getAllPostsController");


getPostsRoute.get("/", getBlogPosts.getAllBlogPosts)

getPostsRoute.get("/:id", getBlogPosts.getPostById)

module.exports = { getPostsRoute }