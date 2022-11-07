const express = require("express");
const app = express()
const blogRoute = express.Router();
const blogModel = require("../Models/blogSchema");
const userModel = require("../Models/usersSchema")


const bodyParser = require("body-parser");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));


blogRoute.get("/", async (req, res) => {
    //It should also be searchable by author, title and tags.
    //It should also be orderable by read_count, reading_time and timestamp

    const { query } = req;
    const { author, 
        title, 
        tags, 
        timestamps
        // page = 1,
        // per_page = 0,
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

    const QueryByOrder = {};

    if (timestamps) {
         QueryByOrder.timestamps = timestamps //{
        //     $gt: moment(timestamp).toDate(),
        //     $lt: moment(timestamp).toDate()
        // }
    }
    console.log(QueryByOrder)
    
    try {
    const returnAllArticles = await blogModel.find(searchQuery).sort(QueryByOrder)/*.limit(page).skip(per_page)*/;
        
            return res.json({
            message: "Request Successful!",
            data: returnAllArticles
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


//     const { title, description, state, tags, body } = req.body;

//     if (!title || !description || !state || !tags || !body) {
//       return next(new Error("Please provide all the required fields", 400));
//     }
  
//     // find the user who is creating the blog
//     const user = await userModel.findById(req.user[0]._id);
//     console.log(req.user._id);
  
//     // const time = readingTime(body);
//     // const reading_time = `${time} min read`;
  
//     // create the blog
//     const newArticle = new blogModel({
//       title: title,
//       description: description,
//       author: `${user.firstName} ${user.lastName}`,
//       //reading_time: reading_time,
//       state: state,
//       tags: tags,
//       body: body,
//       user: user._id,
//     });
  
//     // save the blog
//     const savedArticle = await newArticle.save();
  
//     // add the blog to the user's blogs array
//     user.articles = user.articles.concat(savedArticle._id);
  
//     // save the user
//     await user.save();
  
//     res.status(201).json({
//       status: "success",
//       message: "Article created successfully",
//       data: {
//         blog: savedArticle,
//       },
//     });
//   });




    
//     const userId = user._id;
//     console.log(userId);
    const {title, description, author, state, tag, body} = req.body;

    // const User = await userModel.findById(user._Id);
    // console.log(User);
    

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

blogRoute.patch("/:id", async (req, res) => {
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