const mongoose = require("mongoose");

const blogSchema = mongoose.Schema;


const blogModel = new blogSchema({
    title: {
        type: String,
        required: [true, "Please provide a title for your blog post"],
        unique: [true, "This title already exist"]
    },
    description: String,
    author: {
        type: String,
        required: true,
      },
    body: {
        type: String,
        required: [true, "Please provide a content for your blog post"]
    },
    tags: [String],
    state: {
        type: String,
        enum: {
            values: ["draft", "published"],
            message: "State can only either be in: draft, published"
        },
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