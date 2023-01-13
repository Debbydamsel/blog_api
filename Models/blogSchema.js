const mongoose = require("mongoose");

const blogSchema = mongoose.Schema;


const blogModel = new blogSchema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    author: {
        type: String,
        required: true
      },
    body: {
        type: String,
        required: true
    },
    tags: [String],
    state: {
        type: String,
        enum: ["draft", "published"],
        default: "draft"
    },
    read_count: {
        type: Number,
        default: 0
    },
    user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'users',
    },
    reading_time: String,
    

}, { timestamps: true })

module.exports = mongoose.model("blogPosts", blogModel);