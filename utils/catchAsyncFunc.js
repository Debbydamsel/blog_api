
//N.B: REMEMBER THAT THIS CAN ONLY BE USED FOR ASYNC. FUNCTION AND NOT FOR SYNC. FUNCTIONS
function catchAsyncFn(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(next)
    }
}




module.exports = catchAsyncFn;