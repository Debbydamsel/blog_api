const express = require("express");
const app = express()

const blogModel = require("../Models/blogSchema");
//const moment = require("moment");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
const AppError = require("../utils/appError");



async function getAllBlogPosts(req, res, next) {
    //It should also be searchable by author, title and tags.
    //It should also be orderable by read_count, reading_time and timestamp

    let { query } = req;
    let { 
        author, 
        title, 
        tags, 
        page = 1, 
        per_page = 20,
        order_by = "reading_time",
        order = "asc"
    } = query;

    const searchQuery = {};

    if(author) {
        searchQuery.author = author;
    }

    if (title) {
        searchQuery.title = title;
    }

    if (tags) {
        searchQuery.tags = tags;
    }
    console.log(searchQuery);

    let queryByOrder = {};

    let sortbyTheDiffFieldsRequired = order_by.split(",");
    console.log(sortbyTheDiffFieldsRequired);

    for (let field of sortbyTheDiffFieldsRequired) {
        if (order_by && order === "asc") {
            queryByOrder[field] = 1

            
        }
        if (order_by && order === "desc") {
            queryByOrder[field] = -1

            //  QueryByOrder.timestamps = timestamps //{
            // //     $gt: moment(timestamp).toDate(),
            // //     $lt: moment(timestamp).toDate()
            // // }
        }
    }
        const returnAllArticles = await blogModel.find(searchQuery).populate("user", {firstName: 1, lastName: 1}).sort(queryByOrder).limit(per_page * 1).skip((page - 1) * per_page);
        const count = await blogModel.count();
        
            return res.json({
            message: "Request Successful!",
            totalPages: (count / per_page),
            current_page: page, 
            data: returnAllArticles
            });
}


async function getPostById(req, res, next) {
    const { id } =  req.params;
    
        const getPostById = await blogModel.findById(id).populate("user", {firstName: 1, lastName: 1});

        if (!getPostById) {
            return next(new AppError("No blogPost with that ID found, check the ID and try again!", 404))//COMING FROM OUR AppError function CLASS CREATED IN UTILS;
        }
        getPostById.read_count++;
        await getPostById.save()

        res.json({
            message: "Here you go!",
            getPostById
        })
   
}

module.exports = {
    getAllBlogPosts,
    getPostById
}