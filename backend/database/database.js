import mongoose from "mongoose";


// const DB_URL = "mongodb+srv://MREN:MREN@cluster0.jzydmfw.mongodb.net/protfoilo_data?retryWrites=true&w=majority"



const connectDataBase = ()=>{

    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("mongoDB conected")
    })

}

export default connectDataBase;