import mongoose from "mongoose"

const HospitalSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    password :{
        type:String,
        required:true
    },
    about:{
        type:String,
        default:''
    },
    address:{
        type:String,
        default:""
    },
    place:{
        type:String,
        default:""

    },
    image:{
        type:Object,
        default:{
            url:"https://img.freepik.com/free-vector/people-walking-sitting-hospital-building-city-clinic-glass-exterior-flat-vector-illustration-medical-help-emergency-architecture-healthcare-concept_74855-10130.jpg",
            secure_url:"https://img.freepik.com/free-vector/people-walking-sitting-hospital-building-city-clinic-glass-exterior-flat-vector-illustration-medical-help-emergency-architecture-healthcare-concept_74855-10130.jpg"
        }
    },
    proof:{
        type:Object,
    },
    documentNo:{
        type:String
    },
    mobile:{
        type:Number
    },
    active:{
        type:Boolean,
        default:false
    },
    block:{
        type:Boolean,
        default:false,
    },
    rejected:{
        type:Boolean,
        default:false,
    },
    rejectedMessage:{
        type:String,
        default:""
    },
    wallet:{
        type:Number,
        default:0
    }
})

const HospitalModel=mongoose.model("Hospital", HospitalSchema)
export default HospitalModel