import cloudinary from '../config/cloudinary.js'
import DoctorModel from '../models/DoctorModel.js';
import BookingModel from '../models/BookingModel.js';
import EMRModel from '../models/EMRModel.js'
import HospitalModel from '../models/HospitalModel.js'
import ScheduleModel from '../models/ScheduleModel.js';
import sentMail from '../helpers/sentMail.js';
export async function editDoctorProfile(req, res){
    try{
        const {image}= req.body;
        const data=await cloudinary.uploader.upload(image,{
            folder:'docOnline'
        })
        await DoctorModel.findByIdAndUpdate(req.doctor._id, {$set:{image:data}})
        res.json({result:data, err:false})

    }catch(error){
        console.log(error);
        req.json({err:true, error, message:"something went wrong"})
    }
}

export async function getDoctorProfile(req, res){
    try{
       
        res.json({doctor:req.doctor, err:false})

    }catch(error){
        console.log(error);
        req.json({err:true, error, message:"something went wrong"})
    }
}

export async function getDoctorBookings(req, res){
    try{
        const name= req.query.name ?? "";
        const bookings = await BookingModel.aggregate([
            {$lookup:{
                from:"users",
                localField:"userId",
                foreignField:"_id",
                as:'user'
            }},
            {$unwind:"$user"},
            {
                $match:{
                    doctorId:req.doctor._id,
                    $or:[
                        {'user.name':new RegExp(name)},
                        {patientName:new RegExp(name)}
                    ]

                }
            },
            {
                $sort:{
                    _id:-1
                }
            }
        ])
        return res.json({err:false, bookings})
    }catch(error){
        console.log(error)
        res.json({err:true, error, message:"something went wrong"})
    }
}

export async function addEMR(req, res) {
    try {
        const {
            userId, bookingId, prescription,patientName,age, weight, gender
        } = req.body;

        const emr= await EMRModel.updateOne({bookingId}, {
            doctorId:req.doctor._id,
            userId, bookingId, prescription, patientName, age, weight, gender
        }, {upsert:true})
        
        await BookingModel.findByIdAndUpdate(bookingId, {
            $set:{
                status:'completed'
            }
        })
        await HospitalModel.updateOne({_id:req.doctor.hospitalId},{
            $inc:{
                wallet:doctor.fees
            }
        })
        res.json({err:false})
        
    } catch (err) {
        console.log(err)
        res.json({ err: true, error: err, message: "Something Went Wrong" })
    }
}

export async function getEMR(req, res) {
    try {
        const {bookingId}=req.params;
        const emr= await EMRModel.findOne({bookingId}).populate('doctorId')
        res.json({err:false, emr})
        
    } catch (err) {
        res.json({ err: true, error: err, message: "Something Went Wrong" })
    }
}

export async function getDoctorTodayBookings(req, res){
    try{
        const bookings = await BookingModel.find({
             $and: [
                {date: {$gt: new Date(new Date(new Date().setHours(0,0,0,0)).setDate(new Date().getDate()))}},
                {date: {$lt: new Date(new Date(new Date().setHours(0,0,0,0)).setDate(new Date().getDate()+1))}},
                {doctorId:req.doctor._id}
             ]
        }).sort({ _id:-1}).populate('userId')
        return res.json({err:false, bookings})

    }catch(error){
        console.log(error)
        res.json({err:true, error, message:"something went wrong"})
    }
}

export async function getDoctorSchedule(req, res) {
    try {
        const schedule = await ScheduleModel.findOne({ doctorId:req.doctor._id });
        if (schedule) {
            return res.json({ err: false, schedule })
        } else {
            return res.json({
                err: false, schedule: {
                    mon: [],
                    tue: [],
                    wed: [],
                    thu: [],
                    fri: [],
                    sat: [],
                    sun: []
                }
            })
        }
    } catch (err) {
        console.log(err)
        res.json({ err: true, error: err, message: "Something Went Wrong" })
    }
}

export async function SendVideoInvite(req,res){
    try{
         const email =  req?.body?.userEmail;
         const roomID= req?.body?.roomID;
         const doctor =req?.body?.doctorName;
         await sentMail(
            email,
            `Your Appointment with ${doctor} is ready`,
            "Join the Link and Meet the doctor",
            `http://localhost:3001/videocall/${roomID}`
          );
    }catch(err){
         res.json({ err: true, error: err, message: "Something Went Wrong" })
    }
}

