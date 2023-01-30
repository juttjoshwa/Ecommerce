
import mongoose from "mongoose";


const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required : [true, "please Enter Name"],
        trim : true
    },
    description: {
        type: String,
        required : [true, "Please Enter Description"]
    },
    price: {
        type : Number,
        required : [true , "Please Enter Price"],
        maxLength : [8 , "Price Connot be exceed from 8 characters"]
    },
    rating : {
        type : Number,
        default : 0
    },
    image :[
        {
            public_id :{
                type : String,
                required : true
            },  
            Url :{
                type : String,
                required : true
            }
        }
    ],
    catagory :{
        type : String,
        required : [true , "Please Enter Catagory of Products"]
    },
    stock :{ 
        type : Number,
        required : [true , " Please Enter product stock"],
        maxLength : [4 , "stock Connot Exceed Form 4 characters"],
        default : 1
    },
    NumberofReviews : {
        type : Number,
        default : 0
    },

    reviews : [{
        name : {
            type : String,
            required : true
        },
        ratting : {
            type : Number,
            required : true     

        },
        comment :{
            type : String,
            required : true
        }
    }],
    user:{
        type:mongoose.Schema.ObjectId,
        ref : "User",
        required : true,
     },
    createdAt :{
        type  : Date,
        default : Date.now
    }
})

const productModel = mongoose.model("product" , productsSchema)
export default productModel;
