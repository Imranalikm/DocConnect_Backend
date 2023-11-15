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
    payment:{
        type:Object,
        default:{}
    },
    date:{
        type: Date,
        required:true
    },
    timeSlot:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        required:true
    },
    fees:{
        type:Number,
        required:true
    },
    patientName:{
        type:String,
        default:""
    },
    age:{
        type:Number,
        default:""
    },
    token:{
        type:String,
        default: Math.ceil(Math.random() *100000)
    },
    status:{
        type:String,
        default:"upcoming"
    }
},{timestamps:true })

const BookingModel=mongoose.model("Booking", schema)
export default BookingModel