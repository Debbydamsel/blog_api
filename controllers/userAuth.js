const express = require("express");
const authRoute = express.Router();
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const userModel  = require("../Models/usersSchema");
const usersRoute = require("../routes/usersRoute");


    async function authUser(req, res, next) {


  //     let token;
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   token = req.headers.authorization.split(" ")[1];
  // }
  // if (!token) {
  //   return next(new Error("Unauthorized!!!. Please login to continue", 401));
  // }
  // // Verify the token
  // const user = await promisify(jwt.verify)(token, secretKey);

  // // check if the user still exists
  // const CurrentUser = await userModel.findById(user.id);
  // if (!CurrentUser) {
  //   return next(new Error("User no longer exists", 401));
  // }

  // req.user = CurrentUser;
  // next();




  //      .headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   token = req.headers.authorization.split(" ")[1];
  // }

  // req.token = token;
  // if (!token) let token;
  // if (
  //   req {
  //   return next(res.json({message: "You are unauthorized! Please login to continue"}));
  // }


  // //Verify the token

  // const user = await promisify(jwt.verify)(req.token, secretKey);
  // //console.log(user)
  // //console.log(user.id);

  // //check if the user still exists
  
  // // let presentUser = await userModel.findById(user.);
  // // //req.user = presentUser;
  // // console.log(presentUser);
  // // if (!presentUser) {
  // //   return next(res.json({message: "User does not exist"}));
  // // }

  // //req.user = user;
  // next();

   try {
        const authUser = req.headers["authorization"];
    
        if (typeof bearerToken !== "defined") {
            const splitingBearerAndToken = authUser.split(" ");
            const bearerToken = await splitingBearerAndToken[1]
            //console.log({ authUser });
            //console.log(bearerToken);
            req.token = bearerToken;
           
           //console.log(req.token);
            return next();
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