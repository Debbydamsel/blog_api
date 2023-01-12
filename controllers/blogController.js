const express = require("express");
const app = express()
const blogRoute = express.Router();
const blogModel = require("../Models/blogSchema");
const userModel = require("../Models/usersSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;


const bodyParser = require("body-parser");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));


async function getAllBlogPosts(req, res)  {


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
    //console.log(QueryByOrder); 
    
    try {
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
    }catch (err) {
        console.log(err);
        res.json({
            message: "An error occurred while getting all articles",
            err: err.message
        })
    }
}



async function getBlogPostById (req, res) {
    const { id } =  req.params;

    

    try {
        const getPostById = await blogModel.findById(id).populate("user", {firstName: 1, lastName: 1});

            getPostById.read_count += 1;
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

async function getUsersBlogPosts(req, res) {
    const {query}  = req;
    console.log(query);
    
    try {
            let {user} = query;
            
           let findUser = await blogModel.find({user});
            
            res.json({findUser});

    } catch (error) {
        res.json({message: "An error Occurred!", error})
    }
}



async function createBlogPost(req, res) {



    const {title, description, state, tag, body} = req.body;
    

     const bodyCount = Math.ceil((body.split(" ").length) / 200);
     
    
        
        
    try {

            const authUser = req.headers["authorization"];
    

            const splitingBearerAndToken = authUser.split(" ");
            const bearerToken = await splitingBearerAndToken[1]
        
            req.token = bearerToken;
             // //Verify the token
             const user = await jwt.verify(req.token, SECRET_KEY);

            // //check if the user still exists
            let presentUser = await userModel.findById(user.userId);
            
        const blogPost = await blogModel.create({
       // read_count: 1,
            reading_time: bodyCount,
            title, 
            description,
            state,
            tag,
            author: `${presentUser.firstName} ${presentUser.lastName}`, 
            body,
            user: user.userId
            //timestamp: moment().toDate(),
        })

        // To save the blog's id to the blog field in the user's schema 
        const savedBlog =  await blogPost.save();
        presentUser.blog = presentUser.blog.concat(savedBlog._id);
        await presentUser.save();


        res.json({
            message:"Uploading of article successful!",
            savedBlog
        })
    }catch (err){
        res.send(err.message);
        
    }   
    
    
}

async function updateBlogPost(req, res) {
    const { id } = req.params;
    const { state, title, description, body } = req.body;
    console.log(state);
    try {

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
         //console.log(findBlog.user);
        const gettingTheIdFromRef = findBlog.user[0].valueOf();
        //console.log(gettingTheIdFromRef);
       

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
        
        
    } catch (err) {
        res.json({
            message: "An Error occurred while updating!",
            data: err.message
        })
    }
        
}



async function deleteBlogPost(req, res) {
    const { id }= req.params;
    
    try {

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
        res.json({
            message: "deletion Successful",
        })
        
    } catch (err) {
        res.json({
            message: "An Error occurred while deleting!",
            data: err.message
        })
    }    
}

module.exports = {
    getAllBlogPosts,
    getBlogPostById,
    getUsersBlogPosts,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost
}