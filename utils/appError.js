//This is an error class of our own so that we dont have to always write the error code all the time   
    //ES 6 classes where one class inherits from another class. In this case, the apperror object is inheriting from js built-in error object.

class AppError extends Error {
    //The constructor is always called each time we create a new object out of the apperror class. The constructor holds what we want to pass to the new object created from the apperror class.
    constructor (message, statusCode) {               //remember to change this to status to see what happens
       //super is used to call the parent constructor(error class) and message is used because it is the only parameter the built in error accepts and by doing this we have already added the message property to our incoming message . This basically like we are calling error.
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }     
}

module.exports = AppError;