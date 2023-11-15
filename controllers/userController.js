import DoctorModel from '../models/DoctorModel.js';
import DepartmentModel from '../models/DepartmentModel.js';
import HospitalModel from '../models/HospitalModel.js';
import ScheduleModel from '../models/ScheduleModel.js';  
import minuteDiff from '../helpers/minuteDifference.js';
import BookingModel from '../models/BookingModel.js';


export async function getDoctor(req, res) {
    try {
       
        const doctor = await DoctorModel.findById(req.params.id, { password: 0 }).populate('department').populate('hospitalId', 'name');
        
        res.json({
            err: false, doctor
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

export async function getAllDoctors(req, res) {
    try {
        const name = req.query.name ?? "";
        const department = req.query.department ?? "";
        const hospital = req.query.hospital ?? "";
        const sort = req.query.sort ?? "";
        const sortValue = parseInt(sort);
        let doctors = []
        if (sortValue) {
            if (hospital) {
                doctors = await DoctorModel.find({ $or: [{ name: new RegExp(name, 'i'), }, { tags: new RegExp(name, 'i') }], department: department, hospitalId: hospital }, { password: 0 }).populate('hospitalId', 'name').populate('department', 'name').sort({ fees: sortValue }).lean()
            }
            else if (department) {
                doctors = await DoctorModel.find({block:false,$or: [{ name: new RegExp(name, 'i'), }, { tags: new RegExp(name, 'i') }], department: department }, { password: 0 }).populate('hospitalId', 'name').populate('department', 'name').sort({ fees: sortValue }).lean()
            }
            else {
                doctors = await DoctorModel.find({block:false, $or: [{ name: new RegExp(name, 'i'), }, { tags: new RegExp(name, 'i') }] }, { password: 0 }).populate('hospitalId', 'name').populate('department', 'name').sort({ fees: sortValue }).lean()
            }
        } else {
            if (hospital) {
                doctors = await DoctorModel.find({block:false, $or: [{ name: new RegExp(name, 'i'), }, { tags: new RegExp(name, 'i') }], department: department, hospitalId: hospital }, { password: 0 }).populate('hospitalId', 'name').populate('department', 'name').lean()
            }
            else if (department) {
                doctors = await DoctorModel.find({block:false ,$or: [{ name: new RegExp(name, 'i'), }, { tags: new RegExp(name, 'i') }], department: department }, { password: 0 }).populate('hospitalId', 'name').populate('department', 'name').lean()
            }
            else {
                doctors = await DoctorModel.find({ block:false,$or: [{ name: new RegExp(name, 'i'), }, { tags: new RegExp(name, 'i') }] }, { password: 0 }).populate('hospitalId', 'name').populate('department', 'name').lean()
            }
        }
        
        
        res.json({err:false, doctors })

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
            hospitals = await HospitalModel.find({ active: true, rejected: false,name: new RegExp(name, 'i'), _id: { $in: department.hospitalId } }, { password: 0 }).lean()
        } else {
            hospitals = await HospitalModel.find({active: true, rejected: false, name: new RegExp(name, 'i') }, { password: 0 }).lean()
        }
       

        res.json({ err:false, hospitals })
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
        

        
        const hospital = await HospitalModel.findById(req.params.id, { password: 0 });
        const departments = await DepartmentModel.find({ hospitalId: hospital._id }, { password: 0 });
        res.json({
            err: false, hospital, departments
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