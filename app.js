const express = require("express");
const bodyParser = require("body-parser");
const { connectToDb } = require("./mongoConnect");
const { blogRoute } = require("./routes/blogRoute");
const { getPostsRoute } = require("./routes/getPostsRoute")

const { authUser } = require("./controllers/userAuth");
const { usersRoute } = require("./routes/usersRoute");



require("dotenv").config()
const port = process.env.PORT;

const app = express();
connectToDb();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));



app.use("/users", usersRoute)

app.use("/getPosts", getPostsRoute);

app.use("/posts", authUser, blogRoute)

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to your favourite blog app"
    })
})



app.listen(port, () => {
    console.log(`Server listeniing to requests on port ${port} `)
})