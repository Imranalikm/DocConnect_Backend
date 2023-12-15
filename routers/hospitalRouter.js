import express from "express";
import {
  addDepartment,
  addDoctor,
  blockDoctor,
  editDepartment,
  editDoctor,
  getDepartments,
  getDoctors,
  unBlockDoctor,
  updateSchedule,
  getSchedule,
  editHospitalProfile,
  getHospitalProfile,
  hospitalDashboard,
  getHospitalComplaints,
  withdrawWallet

} from "../controllers/hospitalController.js";

const Router = express.Router();

Router.post("/department", addDepartment);
Router.patch("/department", editDepartment);
Router.get("/departments", getDepartments);

Router.get("/doctors", getDoctors);
Router.post("/doctor", addDoctor);
Router.patch("/doctor", editDoctor);
Router.patch("/doctor/block", blockDoctor);
Router.patch("/doctor/unblock", unBlockDoctor);
Router.patch("/doctor/schedule", updateSchedule)
Router.get("/doctor/schedule/:doctorId", getSchedule)

Router.patch("/profile", editHospitalProfile)
Router.get("/profile", getHospitalProfile)

Router.get("/dashboard", hospitalDashboard)

Router.get('/complaints', getHospitalComplaints)



Router.post("/withdraw", withdrawWallet)


export default Router