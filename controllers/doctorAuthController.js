import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"
import DoctorModel from '../models/DoctorModel.js';
import crypto from 'crypto'
import sentOTP from '../helpers/sentOTP.js';

var salt = bcrypt.genSaltSync(10);


export async function doctorLogin(req, res) {
    try {
        const { email, password } = req.body;
        const doctor = await DoctorModel.findOne({ email})
        if (!doctor){
            return res.json({ err: true, message: "No Doctor Found" })
        }
        if (doctor.block)
            return res.json({ err: true, message: "You are blocked" })
        const doctorValid = bcrypt.compareSync(password, doctor.password);
        if (!doctorValid)
            return res.json({ err: true, message: "wrong Password" })
        const token = jwt.sign(
            {
                id: doctor._id
            },
            process.env.JWT_SECRET_KEY
        )
        return res.cookie("doctorToken", token, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: "none",
        }).json({ err: false })
    }
    catch (err) {
        console.log(err)
        res.json({ message: "somrthing went wrong", error: err, err:true })
    }
}


export const checkDoctorLoggedIn = async (req, res) => {
    try {
        const token = req.cookies.doctorToken;
        if (!token)
            return res.json({ loggedIn: false, error: true, message: "no token" });

        const verifiedJWT = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const doctor = await DoctorModel.findOne({_id:verifiedJWT.id, block:false}, { password: 0 });
        if (!doctor) {
            return res.json({ loggedIn: false });
        }
        if(doctor.block){
            return res.json({ loggedIn: false });
        }
        return res.json({ doctor, loggedIn: true });
    } catch (err) {
        console.log(err)
        res.json({ loggedIn: false, error: err });
    }
}

export const doctorLogout = async (req, res) => {
    res.cookie("doctorToken", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none",
    }).json({ message: "logged out", error: false });
}
