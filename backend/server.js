import dotenv from "dotenv";
import app from "./app.js";
import connectDataBase from "../backend/database/database.js"



//handling Uncaught Execption
process.on("uncaughtException",(err)=>{
     console.log(`Error : ${err.message}`)
     console.log("Shutting down the Server due to Uncaught Execption")

     process.exit(1)
})


//config
dotenv.config({path:"E:/MernProjectFor/backend/config/config.env"})

//connectDB
connectDataBase()

 const server =  app.listen(process.env.PORT,()=>{
    console.log(`SERVER IS working on http://localhost: ${process.env.PORT}`) 
})


// Unhandled Promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the Server due to Unhanlded Promise Rejection")


    server.close(()=>{
        process.exit(1)
    })
})