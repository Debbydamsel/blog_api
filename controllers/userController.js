const express = require("express");
const userRoute = express.Router();

const userModel = require("../Models/usersSchema");

async function getAllUsers(req, res) {
    
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
    
}

module.exports = {
    getAllUsers
}