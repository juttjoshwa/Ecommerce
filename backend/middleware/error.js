import ErrorHandler from "../../backend/utils/ErrorHandler.js"

 const middlewareError = (err , req, res, next)=>{

    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"


    // worng MongoDB ID error
    if(err.name === "CastError"){
        const message = `Resource Not Found . Invalid : ${err.path}`;

        err = new ErrorHandler(message,400);
    }
    
    res.status(err.statusCode).json({
        success : false,
        message : err.message,

    })

    // mongoose dulpilcate key error 

    if(err.code === 11000 ){
        const meassge = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message,400)
    }

    // Wrong JWT error
    if(err.name === "jsonWebTokenError"){
        const message = `json Web Token is invalid, Try again`

        err = new ErrorHandler(message,400);
    }

    // JWT Expire error 
    if(err.name === "TokenExpiredError"){
        const message = `json Web Token is Expired, Try again`

        err = new ErrorHandler(message,400);
    }
}

export default middlewareError;