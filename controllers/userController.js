import DoctorModel from '../models/DoctorModel.js';
import DepartmentModel from '../models/DepartmentModel.js';
import HospitalModel from '../models/HospitalModel.js';
import ScheduleModel from '../models/ScheduleModel.js';  
import minuteDiff from '../helpers/minuteDifference.js';
import BookingModel from '../models/BookingModel.js';
import UserModel from '../models/UserModel.js';
import cloudinary from '../config/cloudinary.js'
import EMRModel from '../models/EMRModel.js';
import FeedbackModel from '../models/FeedbackModel.js';
import ComplaintModel from '../models/ComplaintModel.js'
import sentMail from "../helpers/sentMail.js"


export async function getDoctor(req, res) {
    try {
        const booking = await EMRModel.findOne({
            doctorId: req.params.id,
            userId: req.user._id
        })
        let totalRating = 0;

        const chatAccess = await BookingModel.findOne({
            doctorId: req.params.id,
            userId: req.user._id
        })

        const reviews = await FeedbackModel.find({
            doctorId: req.params.id
        }).populate('userId').lean()

        const review = await FeedbackModel.findOne({
            doctorId: req.params.id,
            userId: req.user._id
        }).lean()

        for (let item of reviews) {
            totalRating += item.rating
        }
        let reviewCount = reviews.length != 0 ? reviews.length : 1;
        const rating = totalRating / reviewCount;
        const doctor = await DoctorModel.findById(req.params.id, { password: 0 }).populate('department').populate('hospitalId', 'name');
        res.json({
            err: false, doctor,
            reviewAccess: booking ? true : false,
            AccessforChat:chatAccess ? true: false,
            rating, reviews, review
        })

    } catch (err) {
        console.log(err)
        res.json({ err: true, error: err })
    }
}

export async function getAllDepartments(req, res) {
    try {
        const departments = await DepartmentModel.find().lean()
        res.json({err:false, departments })
    } catch (err) {
        console.log(err)
        res.json({ err: true, error: err })
    }
}

export async function getAllHospitals(req, res) {
    try {
        const name = req.query.name ?? "";
        const departmentId = req.query.department ?? "";
        let hospitals = []
        if (departmentId) {
            let department = await DepartmentModel.findOne({ _id: departmentId });
            hospitals = await HospitalModel.find({ name: new RegExp(name, 'i'), _id: { $in: department.hospitalId } }, { password: 0 }).lean()
        } else {
            hospitals = await HospitalModel.find({ name: new RegExp(name, 'i') }, { password: 0 }).lean()
        }
        const ratingData = await FeedbackModel.aggregate([
            {
                $group:{
                    _id:"$hospitalId",
                    rating:{$avg:"$rating"}
                }
            }
        ])

        const rating = {}

        ratingData.map((item)=>{
            if(item._id!==null){
                rating[item._id.valueOf()]=item.rating
            }
        })

        res.json({ err:false, hospitals, rating })
    } catch (err) {
        console.log(err)
        res.json({ err: true, error: err })
    }
}

export async function getAllDoctors(req, res) {
    try {
        const name = req.query.name ?? "";
        const department = req.query.department ?? "";
        const hospital = req.query.hospital ?? "";
        const sort = req.query.sort ?? "";
        const SortedValue = parseInt(sort)
        let doctors = []
        if (sort) {
            if (hospital) {
                doctors = await DoctorModel.find({ $or: [{ name: new RegExp(name, 'i'), }, { tags: new RegExp(name, 'i') }], department: department, hospitalId: hospital }, { password: 0 }).populate('hospitalId', 'name').populate('department', 'name').sort({ fees: SortedValue }).lean()
            }
            else if (department) {
                doctors = await DoctorModel.find({ $or: [{ name: new RegExp(name, 'i'), }, { tags: new RegExp(name, 'i') }], department: department }, { password: 0 }).populate('hospitalId', 'name').populate('department', 'name').sort({ fees: SortedValue }).lean()
            }
            else {
                doctors = await DoctorModel.find({ $or: [{ name: new RegExp(name, 'i'), }, { tags: new RegExp(name, 'i') }] }, { password: 0 }).populate('hospitalId', 'name').populate('department', 'name').sort({ fees: SortedValue }).lean()
            }
        } else {
            if (hospital) {
                doctors = await DoctorModel.find({ $or: [{ name: new RegExp(name, 'i'), }, { tags: new RegExp(name, 'i') }], department: department, hospitalId: hospital }, { password: 0 }).populate('hospitalId', 'name').populate('department', 'name').lean()
            }
            else if (department) {
                doctors = await DoctorModel.find({ $or: [{ name: new RegExp(name, 'i'), }, { tags: new RegExp(name, 'i') }], department: department }, { password: 0 }).populate('hospitalId', 'name').populate('department', 'name').lean()
            }
            else {
                doctors = await DoctorModel.find({ $or: [{ name: new RegExp(name, 'i'), }, { tags: new RegExp(name, 'i') }] }, { password: 0 }).populate('hospitalId', 'name').populate('department', 'name').lean()
            }
        }
        const ratingData = await FeedbackModel.aggregate([
            {
                $group:{
                    _id:"$doctorId",
                    rating:{$avg:"$rating"}
                }
            }
        ])
        const rating = {}
        ratingData.map((item)=>{
            if(item._id!==null){
                rating[item._id.valueOf()]=item.rating
            }
        })
        res.json({err:false, doctors, rating })

    } catch (err) {
        console.log(err)
        res.json({ err: true, error: err })
    }
}

export async function getDoctorSchedule(req, res) {
    try {
        const { doctorId } = req.params;
        const schedule = await ScheduleModel.findOne({ doctorId });
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

export async function getHospital(req, res) {
    try {
        const booking = await BookingModel.findOne({
            userId: req.user._id,
            hospitalId: req.params.id
        })
        let totalRating = 0;

        const reviews = await FeedbackModel.find({
            hospitalId: req.params.id
        }).populate('userId').lean()

        const review = await FeedbackModel.findOne({
            hospitalId: req.params.id,
            userId: req.user._id
        }).lean()

        for (let item of reviews) {
            totalRating += item.rating
        }
        let reviewCount = reviews.length != 0 ? reviews.length : 1;
        const rating = totalRating / reviewCount;
        const hospital = await HospitalModel.findById(req.params.id, { password: 0 });
        const departments = await DepartmentModel.find({ hospitalId: hospital._id }, { password: 0 });
        res.json({
            err: false, hospital, departments,
            reviewAccess: booking ? true : false,
            rating, reviews, review
        })

    } catch (err) {
        console.log(err)
        res.json({ err: true, error: err })
    }
}

export async function checkTimeSlot(req, res) {
    try {

        const { schedule, date } = req.body;
        let scheduleArr = []
        for (let item of schedule) {
            const timeSlot = new Date(item.startDate).toLocaleTimeString('en-US') + " - " + new Date(schedule.endDate).toLocaleTimeString('en-US');
            const bookingCount = await BookingModel.find({
                $and: [
                    { date: { $gt: new Date(new Date(new Date(date).setHours(0, 0, 0, 0)).setDate(new Date(date).getDate())) } },
                    { date: { $lt: new Date(new Date(new Date(date).setHours(0, 0, 0, 0)).setDate(new Date(date).getDate() + 1)) } },
                    { timeSlot: new Date(item.startDate).toLocaleTimeString('en-US') + " - " + new Date(item.endDate).toLocaleTimeString('en-US') }
                ]
            }).count();
            const minuteDifference = minuteDiff(item.endDate, item.startDate);


            let minutesPerPatient = Number(minuteDifference) / Number(item.slot)
            minutesPerPatient;

            const totalMinutes = minutesPerPatient * bookingCount;


            const time = new Date(new Date(item.startDate).setMinutes(new Date(item.startDate).getMinutes() + totalMinutes))
            if (bookingCount < Number(item.slot)) {
                scheduleArr.push({
                    startDate: item.startDate,
                    endDate: item.endDate,
                    slot: item.slot,
                    time: time,
                })

            }
        }
        if (scheduleArr[0]) {
            return res.json({
                err: false,
                result: {
                    schedule: scheduleArr,
                    date
                }
            })
        }
        return res.json({ err: true })
    } catch (error) {
        console.log(error)
        return res.json({ error, err: true, message: "something went wrong" })
    }


}


export async function getUserBookings(req, res) {
    try {
        
        let bookings = []
        if (req.query.filter === 'completed') {
            bookings = await BookingModel.find({
                userId: req.user._id,
                status: "completed"
            }).populate('doctorId').sort({ _id: -1 })
        }
        else if (req.query.filter === 'upcoming') {
            bookings = await BookingModel.find({
                userId: req.user._id,
                status: 'upcoming'
            }).populate('doctorId').sort({ _id: -1 })
        }
        else {
            bookings = await BookingModel.find({
                userId: req.user._id
            }).populate('doctorId').sort({ _id: -1 })
        }
        return res.json({ err: false, bookings })

    } catch (error) {
        console.log(error)
        res.json({ err: true, error, message: "something went wrong" })
    }
}


export async function addDoctorFeedback(req, res) {
    try {
        const { doctorId, rating, review } = req.body;
        await FeedbackModel.updateOne({ userId: req.user._id, doctorId }, {
            rating, review
        }, { upsert: true })
        return res.json({ err: false })

    } catch (error) {
        console.log(error)
        res.json({ err: true, error, message: "something went wrong" })
    }
}


export async function addHospitalFeedback(req, res) {
    try {
        const { hospitalId, rating, review } = req.body;
        await FeedbackModel.updateOne({ userId: req.user._id, hospitalId }, {
            rating, review
        }, { upsert: true })
        return res.json({ err: false })

    } catch (error) {
        console.log(error)
        res.json({ err: true, error, message: "something went wrong" })
    }
}


export async function getUserEMR(req, res) {
    try {
        const {bookingId}=req.params;
        const emr= await EMRModel.findOne({bookingId}).populate('doctorId')
        res.json({err:false, emr})
        
    } catch (err) {
        res.json({ err: true, error: err, message: "Something Went Wrong" })
    }
}

export async function cancelBooking(req, res) {
    try {
        const { bookingId } = req.body;
        await BookingModel.updateOne({
            _id: bookingId
        }, {
            $set: {
                status: "refund processing",
                time: new Date(new Date(0).setFullYear(0))
            }
        })
        return res.json({
            err: false
        })
    } catch (error) {
        res.json({ err: true, error, message: "something went wrong" })
    }
}

export async function getTop3Doctors(req, res) {
    try {
        let doctors = await FeedbackModel.aggregate([
            {
                $group: {
                    _id: "$doctorId",
                    totalRating: { $avg: "$rating" }
                }
            },
            {
                $match:{
                    _id:{$ne:null}
                }
            },
            {
                $lookup:{
                    from:"doctors",
                    localField:"_id",
                    foreignField:"_id",
                    as:"doctor"
                }
            },
            {
                $sort:{
                    totalRating:1
                }
            },
            {
                $limit:3
            }
        ])
        doctors= doctors.map(item=>{
            return item.doctor[0]
        })
        const ratingData = await FeedbackModel.aggregate([
            {
                $group:{
                    _id:"$doctorId",
                    rating:{$avg:"$rating"}
                }
            }
        ])

        const rating = {}
        
        ratingData.map((item)=>{
            if(item._id!==null){
                rating[item._id.valueOf()]=item.rating
            }
        })

        console.log(doctors)
        return res.json({err:false, doctors, rating})
    } catch (error) {
        console.log(error)
        res.json({ err: true, message: "something went wrong", error })
    }
}

export async function getTop3Hospitals(req, res) {
    try {
        let hospitals = await FeedbackModel.aggregate([
            {
                $group: {
                    _id: "$hospitalId",
                    totalRating: { $avg: "$rating" }
                }
            },
            {
                $match:{
                    _id:{$ne:null}
                }
            },
            {
                $lookup:{
                    from:"hospitals",
                    localField:"_id",
                    foreignField:"_id",
                    as:"hospital"
                }
            },
            {
                $sort:{
                    totalRating:1
                }
            },
            {
                $limit:3
            }
        ])
        hospitals= hospitals.map(item=>{
            return item.hospital[0]
        })
        const ratingData = await FeedbackModel.aggregate([
            {
                $group:{
                    _id:"$hospitalId",
                    rating:{$avg:"$rating"}
                }
            }
        ])

        const rating = {}
        
        ratingData.map((item)=>{
            if(item._id!==null){
                rating[item._id.valueOf()]=item.rating
            }
        })
        return res.json({err:false, hospitals, rating})
    } catch (error) {
        console.log(error)
        res.json({ err: true, message: "something went wrong", error })
    }
}

export async function addComplaint(req, res) {
    try {
              
        const { complaintAgainst, type,description } = req.body;
        let complaint;
        if (type === 'doctor') {
            complaint = await ComplaintModel.create({
                doctorId: complaintAgainst,
                description,
                type,
                userId: req.user._id
            })
        }
        else {
            complaint = await ComplaintModel.create({
                hospitalId: complaintAgainst,
                description,
                type,
                userId: req.user._id
            })
        }
        await sentMail(req.user.email,
            'Your Complaint Against the ' + type + " is Registered",
            'Your complaint id is ' + complaint.complaintId + '. We will contact you later'
        )
        res.json(
            {
                err: false, complaint
            }
        )

    } catch (error) {
        console.log(error)
        res.json({ err: true, message: "something went wrong", error })
    }

}

export async function resheduleBooking(req,res){
    try{
        console.log("hai");
        const {bookingId,bookDate,bookTimeSlot,online} = req.body;
        const bookings = await BookingModel.findByIdAndUpdate(
            bookingId,
            {
              date: bookDate,
              timeSlot: bookTimeSlot,
              online
            },
            { new: true }
          );
          res.json({
            success: true,
            message: 'Booking rescheduled successfully',
            bookings,
          });
    }catch(error){
        console.log(error)
        res.json({ err: true, message: "something went wrong", error })
    }
}