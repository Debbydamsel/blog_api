const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema;

const userModel = new userSchema({
    email: {
        type: String,
        required: [true, "Please provide an email address"],
        unique: [true, "This email address already exists"]
    },
    firstName: {
        type: String,
        required: [true, "Please enter your first name"]
    },
    lastName: {
        type: String,
        required: [true, "Please enter your last name"]
    },
    password: {
        type: String,
        required: [true, "Enter a valid password"]
    },
    blog: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'blogPosts'
        }
    ]
})
   //Prehook, After any user that signs up, the password gets hashed with the prehook b4 its being saved to the database. 
userModel.pre("save", async function(next) {
    user = this;
    const hash = bcrypt.hash(this.password, 10);
    this.password = hash;
    next()
})

// To ensure that the user enters the correct cretdentials for logging in, we use the ffg codes
userModel.methods.isValidPassword = async function(password) {
    const user = this;
    const comparePasswords = bcrypt.compare(password, user.password);
    return comparePasswords;
}

// userModel.set("toJson", {
//     transform: (document, returnedObject) => {
//         //returnedObject.id = returnedObject._id.toString()
//         //delete returnedObject._id
//         delete returnedObject.__v
//         delete returnedObject.password
//     }
// })



module.exports = mongoose.model("users", userModel)