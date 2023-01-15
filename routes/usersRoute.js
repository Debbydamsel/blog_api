const express = require("express");
const userRoute = express.Router();

const usersController = require("../controllers/userController");



userRoute.get("/", usersController.getAllUsers);

module.exports = userRoute;
