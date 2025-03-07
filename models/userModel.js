import mongoose from "mongoose";
import { type } from "os";


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please provide a username"],
    },
    email:{
        type:String,
        required:[true,"Please provide a email"],
    },
    password:{
        type:String,
        required:[true,"Please provide a password"]
    },
    resetToken:{
        type:String,
        default:null
    },
    tokenExpiry:{
        type:Date,
        default:null
    }
},{strict:false})

const User= mongoose.models.User || mongoose.model("User",userSchema)

export default User