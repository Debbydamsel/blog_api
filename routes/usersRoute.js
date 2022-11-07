const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//const { promisify } = require("util");
//const { authUser } = require("../controllers/userAuth");

const userModel = require("../Models/usersSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config()
const secretKey = process.env.SECRET_KEY
const usersRoute = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false})); 


usersRoute.get("/", async (req, res) => {
    
    const getAllUsers = await userModel.find({}).populate("blogPosts", {author: 1, body: 1});
    

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
    const { email, firstName, lastName, password } = req.body;
    try {
        const user = await userModel.findOne({email});
        //console.log(user);
        //const user._Id = user._id;
        if(!user || user === null) {
            return res.json({
                message: "You are not registered, please sign up!"
            })
        }
        
        const comparison = await bcrypt.compare(password, user.password)
        //console.log(comparison)
        const userId = user._id; 
                if(comparison === true) {
                    jwt.sign({userId}, process.env.SECRET_KEY, { expiresIn: "1h" }, function(err, token) {
                        return res.json({token});
                        
                    })
                }else {
                    return res.json({
                    message: "Invalid password or username"
                    })
                }
                //console.log(token);
    } catch (err) {
        res.json({
            Message: "An error occurred!",
            err
        })
    }
    
    
})


//  usersRoute.post("/", authUser, async  function (req, res, next) {

//     let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }
//   if (!token) {
//     return next(res.json({message: "You are unauthorized! Please login to continue"}));
//   }
//   // Verify the token
//   const user = await promisify(jwt.verify)(token, secretKey);

//   // check if the user still exists
//   const presentUser = await userModel.findById(user.id);
//   if (!presentUser) {
//     return next(res.json({message: "User does not exists"}));
//   }

//   req.user = presentUser;
//   next();

// //     jwt.verify(req.token, secretKey, function (err, authData) {
// //         if (err) {
// //             res.status(403);
// //         }else {
// //             authData,
// //             next()
// //         }
// //     })
        
//  })



module.exports = { usersRoute };

