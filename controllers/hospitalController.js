import cloudinary from '../config/cloudinary.js'
import DoctorModel from "../models/DoctorModel.js";
import bcrypt from "bcryptjs"
import DepartmentModel from '../models/DepartmentModel.js';
import ScheduleModel from '../models/ScheduleModel.js';
import HospitalModel from '../models/HospitalModel.js';

var salt = bcrypt.genSaltSync(10);

export async function getDoctors(req, res) {
    try {
        const name = req.query.name ?? ""
        let doctors = await DoctorModel.find({ hospitalId: req.hospital._id, name: new RegExp(name, 'i') }).lean()
        res.json({ err: false, doctors })
    }
    catch (err) {
        res.json({ message: "somrthing went wrong", error: err, err: true })
    }
}



export async function addDoctor(req, res) {
    try {
        const { password } = req.body;
        const hashPassword = bcrypt.hashSync(password, salt);
        const doctor = await DoctorModel.create({ ...req.body, password: hashPassword, hospitalId: req.hospital._id });
        res.json({ err: false })

    } catch (err) {
        console.log(err)
        res.json({ err: true, error: err, message: "Something Went Wrong" })
    }

}
export async function editDoctor(req, res) {
    try {
        const doctor = await DoctorModel.updateOne({ _id: req.body._id }, { $set: { ...req.body, hospitalId: req.hospital._id } });
        res.json({ err: false })

    } catch (err) {
        console.log(err)
        res.json({ err: true, error: err, message: "Something Went Wrong" })
    }

}
export async function blockDoctor(req, res) {
    try {
        await DoctorModel.updateOne({ _id: req.body.id }, { $set: { block: true } });
        res.json({ err: false })

    } catch (err) {
        console.log(err)
        res.json({ err: true, error: err, message: "Something Went Wrong" })
    }

}
export async function unBlockDoctor(req, res) {
    try {
        await DoctorModel.updateOne({ _id: req.body.id }, { $set: { block: false } });
        res.json({ err: false })

    } catch (err) {
        console.log(err)
        res.json({ err: true, error: err, message: "Something Went Wrong" })
    }

}
// export async function addDepartment(req, res) {
//     try {
//         const department = await DepartmentModel.findOne({
//             name:req.body.department.trim().toLowerCase(),
//             hospitalId:req.hospital._id
//         })
//         if(department){
//             return req.json({
//                 err:true, message:"Department Already Exist"
//             })
//         }
//         await DepartmentModel.updateOne({ name: req.body.department.trim() }, { $set: { name: req.body.department.trim()}, $addToSet: { hospitalId: req.hospital._id } }, { upsert: true })
//         res.json({ err: false })
//     }
//     catch (err) {
//         res.json({ message: "somrthing went wrong", error: err, err: true })
//     }
// }
export async function addDepartment(req, res) {
    try {
        console.log('000000000000000000000000000');

        const department = await DepartmentModel.findOne({
            name: req.body.department.trim().toLowerCase(),
            hospitalId: req.hospital._id,
        });

        if (department) {
            console.log('Department Already Exist');
            return res.json({ err: true, message: "Department Already Exist" });
        }

        const { base64Picture } = req.body;
        console.log('Base64 Picture:', base64Picture);

        if (base64Picture) {
            const data = await cloudinary.uploader.upload(base64Picture, {
                folder: 'docConnect'
            });
            console.log('Cloudinary Upload Result:', data);

            await DepartmentModel.updateOne(
                { name: req.body.department.trim() },
                { $set: { name: req.body.department.trim(), image: data }, $addToSet: { hospitalId: req.hospital._id } },
                { upsert: true }
            );
        } else {
            await DepartmentModel.updateOne(
                { name: req.body.department.trim() },
                { $set: { name: req.body.department.trim() }, $addToSet: { hospitalId: req.hospital._id } },
                { upsert: true }
            );
        }

        console.log('Department added successfully');
        res.json({ err: false });
    } catch (err) {
        console.error('Error:', err);
        res.json({ message: "Something went wrong", error: err, err: true });
    }
}


export async function editDepartment(req, res) {
    try {
        const department = await DepartmentModel.findOne({
            name:req.body.department.trim().toLowerCase(),
            hospitalId:req.hospital._id
        })
        if(department){
            return req.json({
                err:true, message:"Department Already Exist"
            })
        }
        await DepartmentModel.findByIdAndUpdate(req.body.id, { $set: { name: req.body.department.trim().toLowerCase() } })
        res.json({ err: false })
    }
    catch (err) {
        res.json({ message: "somrthing went wrong", error: err, err: true })
    }
}


export async function getDepartments(req, res) {
    try {
        const name = req.query.name ?? ""
        let departments = await DepartmentModel.find({ hospitalId: req.hospital._id, name: new RegExp(name, 'i') }).lean()
        res.json({ err: false, departments })
    }
    catch (err) {
        res.json({ message: "somrthing went wrong", error: err, err: true })
    }
}

export async function updateSchedule(req, res) {
    try {
        
        const { doctorId } = req.body;
        await ScheduleModel.updateOne({ doctorId }, {
            $set: {
                ...req.body
            }
        }, { upsert: true })

        res.json({ err: false })

    } catch (err) {
        console.log(err)
        res.json({ err: true, error: err, message: "Something Went Wrong" })
    }

}

export async function getSchedule(req, res) {
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

export async function getHospitalProfile(req, res) {
    try {

        
      
        const departments = await DepartmentModel.find({ hospitalId: req.hospital._id }, { password: 0 });
        res.json({
            err: false, hospital: req.hospital, departments
        
        })

    } catch (error) {
        console.log(error)
        res.json({ err: true, error, message: "something went wrong" })
    }
}

export async function editHospitalProfile(req, res) {
    let data;
    try {
        const { image, name, about, address, place, mobile } = req?.body;
            
        if (image) {
             data = await cloudinary.uploader.upload(image, {
                folder: 'docConnect'
            })
            await HospitalModel.findByIdAndUpdate(req.hospital._id, {
                $set: {
                    image: data,
                    name, about, address, place, mobile
                }
            })
        } else {
            await HospitalModel.findByIdAndUpdate(req.hospital._id, {
                $set: {
                    name, about, address, place, mobile
                }
            })
        }
        res.json({ result: data, err: false })

    } catch (error) {
        console.log(error);
        res.json({ err: true, error, message: "something went wrong" })
    }
}