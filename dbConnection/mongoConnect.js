const mongoose = require("mongoose");

function connectToDb() {
    mongoose.connect(process.env.MONGODB_CONNECTION_URL);


    mongoose.connection.on("connected", () => {
        console.log("Mongodb connected successfully")
    })

    mongoose.connection.on("err", (err) => {
        console.log(err);
    })
}


module.exports = connectToDb;