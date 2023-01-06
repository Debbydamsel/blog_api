const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const userModel = require("../Models/usersSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY
const usersRoute = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false})); 


usersRoute.get("/", async (req, res) => {
    
    const getAllUsers = await userModel.find({}).populate("blog", {author: 1, body: 1});
    

    try {
        return res.json({
            getAllUsers
        })
    } catch (err) {
        return res.json({
            err
        })
    }
    
})

usersRoute.post("/sign-up", (req, res) => {


    const {email, firstName, lastName, password} = req.body;
     

    bcrypt.hash(password, 10, async (err, hash) => {


        try {
            const user = await userModel.create({
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: hash
            })
            const {password, ...others} = user._doc
            return res.json({
                Message: "User created succesfully",
                data: others
            })
            
        } catch (err) {
            res.json({
                Message: "An error occurred!",
                err
            })
        }
    })
})


usersRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({email});
        console.log(user);
        
        if(!user || user === null) {
            return res.json({
                message: "You are not registered, please sign up!"
            })
        }
        
        const comparison = await bcrypt.compare(password, user.password)
        const userId = user._id; 
                if(comparison === true) {
                    
                    jwt.sign({userId}, process.env.SECRET_KEY/*, { expiresIn: "1h" }*/, (err, token) => {
                        return res.json({token});
                    })
                        
                }else {
                    return res.json({
                    message: "Invalid password or username"
                    })
                }
            
    } catch (err) {
        res.json({
            Message: "An error occurred!",
            err
        })
    }
    
    
})



module.exports = { usersRoute };

