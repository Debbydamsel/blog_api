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


blogRoute.get("/", async (req, res) => {
    //It should also be searchable by author, title and tags.
    //It should also be orderable by read_count, reading_time and timestamp

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
    console.log(order_by);

    console.log(sortByTheDiffFields);

    for (const field of sortByTheDiffFields) {
        if (order === "asc" && order_by  ) {
            QueryByOrder[field] = 1;
        }

        if (order === "desc" && order_by ) {
            QueryByOrder[field] = -1
        }
    }
    console.log(QueryByOrder); 
    
    try {
        const returnAllArticles = await blogModel.find(searchQuery).sort(QueryByOrder).limit(per_page * 1).skip((page - 1)* per_page);

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
        res.json({
            message: "An error occurred while getting all articles",
            err: err.message
        })
    }
})



blogRoute.get("/:id", async (req, res) => {
    const { id } =  req.params;

    

    try {
        const getArticleById = await blogModel.findById(id);

            getArticleById.read_count += 1;
            await getArticleById.save()
        res.json({
            message: "Here you go!",
            getArticleById
        })
    } catch (err) {
        res.json({
            message: "An error occurred while getting all articles",
            err: err.message
        })
    }
    

})


blogRoute.post("/", async (req, res) => {



    const {title, description, author, state, tag, body} = req.body;

    //const user = await jwt.verify(req.token, SECRET_KEY);

    //  const currentUser = await userModel.findById(user.userId);
    //  console.log(currentUser);
    

     const bodyCount = Math.ceil((body.split(" ").length) / 200);
     
    //console.log(bodyCount);
    // let spliting1 = bodyCount.toString().split(".")[0];
    // let spliting2 = bodyCount.toString().split(".")[1]
    //    // console.log(spliting1);
    //     //console.log(spliting2);
    // let multiply = Math.round(Number(spliting2) * 0.60);
    // let convertToNumber = Number(spliting1);
    //    // console.log(multiply);
    // if (multiply > 30 ) {
    //      convertToNumber += 1;

    // }else if (multiply < 30) {
    //      convertToNumber;
    // }
        
        
    try {
        const article = await blogModel.create({
       // read_count: 1,
            reading_time: bodyCount,
            title, 
            description,
            state,
            tag,
            author, 
            body
            //timestamp: moment().toDate(),
        })

        //const savedArticle = await article.save();
        //user.article = user.article.concat(savedArticle._id);

        await article.save();

        res.json({
            message:"Uploading of article successful!",
            article
        })
    }catch (err){
        res.send(err.message);
    }   
    
    
})

blogRoute.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { state } = req.body;
    console.log(state);
    try {
        const updatingById = await blogModel.findByIdAndUpdate(id, {state: state}, {new: true});
        res.json({
            message: "Updating Successful",
            data: updatingById
        })
    } catch (err) {
        res.json({
            message: "An Error occurred while updating!",
            data: err.message
        })
    }
    
})


blogRoute.delete("/:id", async (req, res) => {
    const { id }= req.params;
    
    try {
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
})


module.exports = { blogRoute };