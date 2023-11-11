import cloudinary from '../config/cloudinary.js'
import DoctorModel from "../models/DoctorModel.js";
import bcrypt from "bcryptjs"
import HospitalModel from "../models/HospitalModel.js"



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