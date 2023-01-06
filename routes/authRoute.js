const express = require("express");

const userModel = require("../Models/usersSchema");

require("dotenv").config();

const authRoute = express.Router();

const signUpAndLoginController = require("../controllers/signupAndLoginController");



authRoute.post("/sign-up", signUpAndLoginController.signUp)


authRoute.post("/login", signUpAndLoginController.login)



module.exports = { authRoute };

