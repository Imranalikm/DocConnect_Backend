import express from 'express'
import { blockUser, getUsers,  unBlockUser ,getHospitalRequests,acceptHospital, rejectHospital,getHospitals,blockHospital,unBlockHospital,getAdminComplaints} from '../controllers/adminController.js';

const Router = express.Router();



Router.get("/users", getUsers)
Router.patch("/user/block", blockUser)
Router.patch("/user/unblock", unBlockUser)

Router.get("/hospital/requests", getHospitalRequests)
Router.post("/hospital/accept", acceptHospital)
Router.post("/hospital/reject", rejectHospital)

Router.get("/hospitals", getHospitals)
Router.patch("/hospital/block", blockHospital)
Router.patch("/hospital/unblock", unBlockHospital)

Router.get("/complaints",getAdminComplaints)

export default Router