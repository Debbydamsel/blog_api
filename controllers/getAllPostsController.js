const express = require("express");
const app = express()

const blogModel = require("../Models/blogSchema");
const moment = require("moment");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));



async function getAllBlogPosts(req, res) {
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
        order = "asc",
        timestamps
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

    console.log(queryByOrder)
    
    try {

    
        const returnAllArticles = await blogModel.find(searchQuery).populate("user", {firstName: 1, lastName: 1}).sort(queryByOrder).limit(per_page * 1).skip((page - 1) * per_page);
        const count = await blogModel.count();
        
            return res.json({
            message: "Request Successful!",
            totalPages: (count / per_page),
            current_page: page, 
            data: returnAllArticles
            })
    }catch (err) {
        res.json({
            message: "An error occurred while getting all articles",
            err: err.message
        })
    }
}


async function getPostById(req, res) {
    const { id } =  req.params;

    //for ()

    try {
        const getPostById = await blogModel.findById(id).populate("user", {firstName: 1, lastName: 1});

        getPost.read_count += 1;
        await getPostById.save()

        res.json({
            message: "Here you go!",
            getPostById
        })
    } catch (err) {
        res.json({
            message: "An error occurred while getting all articles",
            err: err.message
        })
    }
    

}

module.exports = {
    getAllBlogPosts,
    getPostById
}