const express = require("express");
const app = express()
const blogModel = require("../Models/blogSchema");
const userModel = require("../Models/usersSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
const AppError = require("../utils/appError");


const bodyParser = require("body-parser");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));



async function getAllBlogPosts(req, res, next)  {
    let { query } = req;
    let { 
        author, 
        title, 
        tags, 
        timestamps,
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
    if (timestamps) {
        QueryByOrder.timestamps = timestamps //{
       //     $gt: moment(timestamp).toDate(),
       //     $lt: moment(timestamp).toDate()
       // }
   }
   

    const QueryByOrder = {};

    const sortByTheDiffFields = order_by.split(",");

    for (const field of sortByTheDiffFields) {
        if (order === "asc" && order_by  ) {
            QueryByOrder[field] = 1;
        }

        if (order === "desc" && order_by ) {
            QueryByOrder[field] = -1
        }
    }
    
        const returnAllArticles = await blogModel.find(searchQuery).populate("user", {firstName: 1, lastName: 1}).sort(QueryByOrder).limit(per_page * 1).skip((page - 1)* per_page);

        //get total documents in the Posts collection
        const count = await blogModel.count();
        
        // return response with total pages, and current page
            res.json({
            message: "Request Successful!",
            totalPages: Math.ceil((count / per_page)),
            currentPage: page,
            data: returnAllArticles,
            
            })
   
}



async function getBlogPostById(req, res, next) {
    const { id } =  req.params;

    

        const getPostById = await blogModel.findById(id).populate("user", {firstName: 1, lastName: 1});
        if (!getPostById) {
            return next(new AppError("No blogPost with that ID found, check the ID and try again!", 404))//COMING FROM OUR AppError function CLASS CREATED IN UTILS;
        }

            getPostById.read_count += 1;
            await getPostById.save()
        res.json({
            message: "Here you go!",
            getPostById
        })
    

};

async function getUsersBlogPosts(req, res, next) {
    const {query}  = req;
    
            let {user} = query;
            
           let findUserPosts = await blogModel.find({user});
          
            
            res.json({findUserPosts});

    
}



async function createBlogPost(req, res, next) {
    const {title, description, state, tag, body} = req.body;
    
    // An algorithm to display how many minutes read an article is. 
     const bodyCount = Math.ceil((body.trim().split(/\s+/).length) / 255);
     const bodyCountInMintues = `${bodyCount} minutes`;
    

            const authUser = req.headers["authorization"];
            const splitingBearerAndToken = authUser.split(" ");
            const bearerToken = await splitingBearerAndToken[1]
            req.token = bearerToken;
             // //Verify the token
             const user = await jwt.verify(req.token, SECRET_KEY);

            // //check if the user still exists
            let presentUser = await userModel.findById(user.userId);
            
        const blogPost = await blogModel.create({
            reading_time: bodyCountInMintues,
            title, 
            description,
            state,
            tag,
            author: `${presentUser.firstName} ${presentUser.lastName}`, 
            body,
            user: user.userId
        })

        // To save the blog's id to the blog field in the user's schema 
        const savedBlog =  await blogPost.save();
        presentUser.blog = presentUser.blog.concat(savedBlog._id);
        await presentUser.save();
        res.json({
            message:"Uploading of article successful!",
            savedBlog
        })
}

async function updateBlogPost(req, res, next) {
    const { id } = req.params;
    const { state, title, description, body } = req.body;
    console.log(state);

        const authUser = req.headers["authorization"];
    

        const splitingBearerAndToken = authUser.split(" ");
        const bearerToken = await splitingBearerAndToken[1]
        
        req.token = bearerToken;
             // //Verify the token
        const user = await jwt.verify(req.token, SECRET_KEY);

            // //check if the user still exists
        let presentUser = await userModel.findById(user.userId);
        const userIdFromdb = presentUser._id.valueOf();
        
         let findBlog = await blogModel.findById(id);
        const gettingTheIdFromRef = findBlog.user[0].valueOf();
       

        if (!state || state === "undefined" || state === "null") {
            res.json({message: "Please enter the correct item you want to update"})
        }
        
        if (userIdFromdb === gettingTheIdFromRef) {
            
            const updatingById = await blogModel.findByIdAndUpdate(id, {state: state}, {new: true});
            res.json({
            message: "Updating Successful",
            data: updatingById
            })
            
        } else {
            res.json({message: "You cannot update this blog because you are not the owner of the blog"});
        }
        
}



async function deleteBlogPost(req, res) {
    const { id }= req.params;

        const authUser = req.headers["authorization"];
        const splitingBearerAndToken = authUser.split(" ");
        const bearerToken = await splitingBearerAndToken[1]
        
        req.token = bearerToken;
             // //Verify the token
        const user = await jwt.verify(req.token, SECRET_KEY);
        //console.log(user);

            // //check if the user still exists
        let presentUser = await userModel.findById(user.userId);
        //console.log(presentUser);
        const userIdFromdb = presentUser._id.valueOf();
        //console.log(userIdFromdb)
        let findBlog = await blogModel.findById(id);
        const gettingTheIdFromRef = findBlog.user[0].valueOf();

        if (userIdFromdb !== gettingTheIdFromRef) {
            res.json({message: "You have to be the owner of this blog to delete it!"})
        }


        const deletingById = await blogModel.findByIdAndDelete(id);
        if (!deletingById) {
            console.log('NO!')
            return next(new AppError("No blogPost with that ID found, check the ID and try again!", 404))//COMING FROM OUR AppError function CLASS CREATED IN UTILS;
        }

        res.json({
            message: "deletion Successful",
        })   
}

module.exports = {
    getAllBlogPosts,
    getBlogPostById,
    getUsersBlogPosts,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost
}