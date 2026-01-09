const mongoose=require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL);

const userschema=new mongoose.Schema({
    username:String,
    password:String,
    todos:[{type:mongoose.Schema.Types.ObjectId,
        ref:"Todo"
    }]
})

const todoschema=new mongoose.Schema({
    title:String,
    description:String,
    completed:{
        type:Boolean,
        default:false
    }
})

const todo=mongoose.model("Todo",todoschema);
const user=mongoose.model("User",userschema);

module.exports={todo,user}