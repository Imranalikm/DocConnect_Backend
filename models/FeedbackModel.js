import mongoose from "mongoose"

const schema = new mongoose.Schema({
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    hospitalId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hospital'
    },
    rating:{
        type:Number,
        required:true
    },
    review:{
        type:String,
        required:true,
    }
},{timestamps:true })

const FeedbackModel=mongoose.model("Feedback", schema)
export default FeedbackModel