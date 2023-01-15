const express = require("express");

const bodyParser = require("body-parser");
const connectToDb = require("./dbConnection/mongoConnect");
const blogRoute  = require("./routes/blogRoute");
const getPostsRoute  = require("./routes/getPostsRoute")

const authUser  = require("./controllers/userAuth");
const authRoute  = require("./routes/authRoute");
const userRoute = require("./routes/usersRoute");
const AppError = require("./utils/appError");
const centralErrorHandler = require("./controllers/errorController");



require("dotenv").config()
const port = process.env.PORT;

const app = express();
connectToDb();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));


//middlewares
app.use("/auth", authRoute);

app.use("/getPosts", getPostsRoute);

app.use("/posts", authUser, blogRoute);

app.use("/users", userRoute);

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to your favourite blog app"
    })
})

//catching all undefined routes
app.all("*", (req, res, next) => {
    // const err = new Error(`This endpoint ${req.originalUrl} is not found on this server!, check the endpoint and try again.`)
    // err.statusCode = 404;
    // err.status = "fail";
    next(new AppError(`This endpoint ${req.originalUrl} is not found on this server!, check the endpoint and try again.`, 404))//COMING FROM OUR AppError function CLASS CREATED IN UTILS;
})


//global error handler middleware
app.use(centralErrorHandler);


//exporting server
module.exports = app;