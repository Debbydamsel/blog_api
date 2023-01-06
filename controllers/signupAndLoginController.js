const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const userModel = require("../Models/usersSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false})); 



function signUp(req, res) {


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
}



async function login(req, res) {
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
                    
                    jwt.sign({userId}, process.env.SECRET_KEY, { expiresIn: "1h" }, (err, token) => {
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
    
    
}

module.exports = {
    signUp,
    login
}