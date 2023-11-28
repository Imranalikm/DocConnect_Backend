import express from 'express';
import {  getDoctor,getAllDepartments ,getAllDoctors,getAllHospitals,getDoctorSchedule,getHospital,checkTimeSlot,getUserBookings,addDoctorFeedback,addHospitalFeedback,getUserEMR} from '../controllers/userController.js';
import {paymentOrder,verifyPayment} from '../controllers/paymentController.js'
const router=express.Router();

router.get("/doctor/:id", getDoctor)
router.get("/departments", getAllDepartments)
router.get("/hospitals", getAllHospitals)

router.get("/doctors", getAllDoctors)
router.get("/doctor/schedule/:doctorId", getDoctorSchedule)
router.get("/hospital/:id", getHospital)
router.post('/check-time', checkTimeSlot)

router.post("/payment", paymentOrder)
router.post("/payment/verify", verifyPayment)
router.get("/booking", getUserBookings)

router.post('/feedback/doctor', addDoctorFeedback)
router.post('/feedback/hospital', addHospitalFeedback)
router.get('/emr/:bookingId', getUserEMR)

export default router