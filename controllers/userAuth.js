const express = require("express");
const authRoute = express.Router();
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const userModel  = require("../Models/usersSchema");
const usersRoute = require("../routes/usersRoute");


    async function authUser(req, res, next) {


   try {
        const authUser = req.headers["authorization"];
    
        if (typeof bearerToken !== "defined") {
            const splitingBearerAndToken = authUser.split(" ");
            const bearerToken = await splitingBearerAndToken[1]
        
            req.token = bearerToken;


            // let presentUser = await userModel.findById(_id);
             // //Verify the token

             const user = await jwt.verify(req.token, SECRET_KEY);
            console.log(user)
            // //console.log(user.id);

            // //check if the user still exists
            
            let presentUser = await userModel.findById(user.userId);
            console.log(user.userId);
    
            console.log(presentUser);
            if (!presentUser) {
              return next(res.json({message: "User does not exist"}));
            }

            //res.json({user});
            next();
        }else {
            res.status(401).json({
                message: "You are not authenticated, please enter a valid token!",
            })
        }
    } catch (err) {
        res.status(401).json({
            message: "You are not authenticated, please enter a valid token!",
            err
        })
    }
        
    
}
    



module.exports = { authUser }