import mongoose from "mongoose"

const ScheduleSchema = new mongoose.Schema({
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor'
    },
    mon:{
        type:Array,
        default:[]
    },
    tue:{
        type:Array,
        default:[]
    },
    wed:{
        type:Array,
        default:[]
    },
    thu:{
        type:Array,
        default:[]
    },
    fri:{
        type:Array,
        default:[]
    },
    sat:{
        type:Array,
        default:[]
    },
    sun:{
        type:Array,
        default:[]
    },
},{timestamps:true })

const ScheduleModel=mongoose.model("Schedule", ScheduleSchema)
export default ScheduleModel