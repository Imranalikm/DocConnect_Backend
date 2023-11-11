import mongoose from "mongoose"

const DoctorSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    hospitalId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hospital'
    },
    email:{
        type: String,
        required:true
    },
    password :{
        type:String,
        required:true
    },
    mobile :{
        type:Number
    },
    department :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Department'
    },
    qualification :{
        type:String,
        default:""
    },
    specialization :{
        type:String,
        default:""

    },
    about :{
        type:String,
        default:""

    },
    tags :{
        type:String,
        default:""

    },
    image :{
        type:Object,
        default:{
            url:"https://thumbs.dreamstime.com/b/default-placeholder-doctor-half-length-portrait-default-placeholder-doctor-half-length-portrait-photo-avatar-gray-color-113631373.jpg",
            secure_url:"https://thumbs.dreamstime.com/b/default-placeholder-doctor-half-length-portrait-default-placeholder-doctor-half-length-portrait-photo-avatar-gray-color-113631373.jpg"
        }
    },
    block:{
      type:Boolean,
      default:false  
    },
    fees :{
        type:Number,
        default:0

    }
    
})

const DoctorModel=mongoose.model("Doctor", DoctorSchema)
export default DoctorModel