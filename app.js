const express = require("express");
const bodyParser = require("body-parser");
const { connectToDb } = require("./dbConnection/mongoConnect");
const { blogRoute } = require("./routes/blogRoute");
const { getPostsRoute } = require("./routes/getPostsRoute")

const { authUser } = require("./controllers/userAuth");
const { authRoute } = require("./routes/authRoute");
const { userRoute } = require("./routes/usersRoute");



require("dotenv").config()
const port = process.env.PORT;

const app = express();
connectToDb();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));



app.use("/auth", authRoute);

app.use("/getPosts", getPostsRoute);

app.use("/posts", authUser, blogRoute);

app.use("/users", userRoute);

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to your favourite blog app"
    })
})



app.listen(port, () => {
    console.log(`Server listeniing to requests on port ${port} `)
})