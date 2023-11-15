import jwt from "jsonwebtoken";
import HospitalModel from "../models/HospitalModel.js";
const verifyHospital = async (req, res, next) => {
    try {
        const token = req.cookies.hospitalToken;
        if (!token)
            return res.json({ loggedIn: false, error: true, message: "no token" });

        const verifiedJWT = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const hospital = await HospitalModel.findOne({_id:verifiedJWT.id}, { password: 0 });
        if (!hospital) {
            return res.json({ loggedIn: false });
        }
        req.hospital=hospital;
        next()
    } catch (err) {
        console.log(err)
        res.json({ loggedIn: false, error: err });
    }
}
export default verifyHospital