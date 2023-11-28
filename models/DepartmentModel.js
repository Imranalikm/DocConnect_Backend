import mongoose from "mongoose"

const schema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    hospitalId:{
        type: Array,
        required:true
    },
    image:{
        type:Object,
        default:{
            url:"https://bharajhospital.in/wp-content/uploads/2015/11/doctor-placeholder-500x500.jpg",
            secure_url:"https://bharajhospital.in/wp-content/uploads/2015/11/doctor-placeholder-500x500.jpg"
        }
    },
})

const DepartmentModel=mongoose.model("Department", schema)
export default DepartmentModel