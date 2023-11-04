import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    password :{
        type:String
    },
    block:{
        type:Boolean,
        default:false
    },
    picture:{
        type:String
    }
})

const UserModel=mongoose.model("User", UserSchema)
export default UserModel