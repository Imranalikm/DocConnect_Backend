import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"
import HospitalModel from '../models/HospitalModel.js';
import cloudinary from '../config/cloudinary.js';
import crypto from 'crypto'
import sentOTP from '../helpers/sentOTP.js';



var salt = bcrypt.genSaltSync(10);


export async function hospitalRegister(req, res){
    try{
        const {name, email, mobile, password}=req.body;
        const proof=await cloudinary.uploader.upload(req.body.proof,{
            folder:'docConnect'
        })
        const hashPassword = bcrypt.hashSync(password, salt);
        const hospital = await HospitalModel.create({...req.body,password:hashPassword, proof});
        const token = jwt.sign(
            {
                id: hospital._id
            },
            process.env.JWT_SECRET_KEY
        )
        return res.cookie("hospitalToken", token, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: "none",
        }).json({ err: false })

    }catch(err){
        res.json({err:true , error:err, message:"Something Went Wrong"})
    }

}

export async function hospitalLogin(req, res) {
    try {
        const { email, password } = req.body;
        const hospital = await HospitalModel.findOne({ email})
        if (!hospital){
            return res.json({ err: true, message: "No Hospital Found" })
        }
        if (hospital.block){
            return res.json({ err: true, message: "Hospital is blocked" })
        }
        
    
        const hospitalValid = bcrypt.compareSync(password, hospital.password);
        if (!hospitalValid)
            return res.json({ err: true, message: "wrong Password" })
        const token = jwt.sign(
            {
                id: hospital._id
            },
            process.env.JWT_SECRET_KEY
        )
        return res.cookie("hospitalToken", token, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: "none",
        }).json({ err: false })
    }
    catch (err) {
        res.json({ message: "somrthing went wrong", error: err, err:true })
    }
}


export const checkHospitalLoggedIn = async (req, res) => {
    try {
        const token = req.cookies.hospitalToken;
        if (!token)
            return res.json({ loggedIn: false, error: true, message: "no token" });

        const verifiedJWT = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const hospital = await HospitalModel.findOne({_id:verifiedJWT.id, block:false}, { password: 0 });
        if (!hospital) {
            return res.json({ loggedIn: false });
        }
        return res.json({ hospital, loggedIn: true });
    } catch (err) {
        console.log(err)
        res.json({ loggedIn: false, error: err });
    }
}

export const hospitalLogout = async (req, res) => {
    res.cookie("hospitalToken", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none",
    }).json({ message: "logged out", error: false });
}