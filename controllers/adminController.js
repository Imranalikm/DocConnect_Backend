import UserModel from "../models/UserModel.js";
import HospitalModel from "../models/HospitalModel.js";
import sentMail from "../helpers/sentMail.js";
export async function getUsers(req, res) {
    try {
      const name = req.query.name ?? "";
      let users = await UserModel.find({ name: new RegExp(name, "i") }).lean();
      res.json({ err: false, users });
    } catch (err) {
      res.json({ message: "something went wrong", error: err, err: true });
    }
  }


  export async function blockUser(req, res) {
    try {
      const {id} = req.body
      await UserModel.findByIdAndUpdate(id, {
        $set: { block: true },
      }).lean();
      res.json({ err: false });
    } catch (err) {
      res.json({ message: "something went wrong", error: err, err: true });
    }
  }
  



  export async function unBlockUser(req, res) {
    try {
      await UserModel.findByIdAndUpdate(req.body.id, {
        $set: { block: false },
      }).lean();
      res.json({ err: false });
    } catch (err) {
      res.json({ message: "something went wrong", error: err, err: true });
    }
  }

  export async function getHospitalRequests(req, res) {
    try {
      
      const hospitalRequests = await HospitalModel.find({
        active: false,
        rejected: { $ne: true },
      }).lean();
      
      console.log(hospitalRequests);
      res.json({ err: false, hospitalRequests });
    } catch (err) {
      res.json({ message: "somrthing went wrong", error: err, err: true });
    }
  }
  export async function acceptHospital(req, res) {
    try {
      const { email } = req.body;
      await HospitalModel.updateOne({ email }, { active: true });
      res.json({ err: false });
      await sentMail(
        email,
        "DocConnect has approved your request for registration",
        "You can proceed to your account"
      );
    } catch (err) {
      res.json({ message: "somrthing went wrong", error: err, err: true });
    }
  }
  export async function rejectHospital(req, res) {
    try {
      const { email } = req.body;
      await HospitalModel.updateOne({ email }, { active: false, rejected: true });
  
      res.json({ err: false });
      await sentMail(
        email,
        "DocConnect has rejected your request for registration",
        "Please try again sometimes"
      );
    } catch (err) {
      res.json({ message: "somrthing went wrong", error: err, err: true });
    }
  }


  export async function getHospitals(req, res) {
    try {
      const name = req.query.name ?? "";
      let hospitals = await HospitalModel.find({
        active: true,
        name: new RegExp(name, "i"),
      }).lean();
      res.json({ err: false, hospitals });
    } catch (err) {
      res.json({ message: "somrthing went wrong", error: err, err: true });
    }
  }

  export async function blockHospital(req, res) {
    try {
      await HospitalModel.findByIdAndUpdate(req.body.id, {
        $set: { block: true },
      }).lean();
      res.json({ err: false });
    } catch (err) {
      res.json({ message: "something went wrong", error: err, err: true });
    }
  }
  
  export async function unBlockHospital(req, res) {
    try {
      await HospitalModel.findByIdAndUpdate(req.body.id, {
        $set: { block: false },
      }).lean();
      res.json({ err: false });
    } catch (err) {
      res.json({ message: "something went wrong", error: err, err: true });
    }
  }
  