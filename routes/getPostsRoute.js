const express = require("express");
const getPostsRoute = express.Router();
const moment = require("moment");

const getBlogPosts = require("../controllers/getAllPostsController");
const catchAsyncFn = require("../utils/catchAsyncFunc");



getPostsRoute.get("/", catchAsyncFn(getBlogPosts.getAllBlogPosts))

getPostsRoute.get("/:id", catchAsyncFn(getBlogPosts.getPostById))

module.exports = getPostsRoute