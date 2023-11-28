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
    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Booking'
    },
    prescription:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default: new Date()
    },
    patientName:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    weight:{
        type:Number,
        required:true,
        default:""
    },
    gender:{
        type:String,
        required:true,
        default:""
    }
},{timestamps:true })

const EMRModel=mongoose.model("EMR", schema)
export default EMRModel