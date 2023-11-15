import express from 'express';
import {  getDoctor,getAllDepartments ,getAllDoctors,getAllHospitals,getDoctorSchedule,getHospital,checkTimeSlot} from '../controllers/userController.js';

const router=express.Router();

router.get("/doctor/:id", getDoctor)
router.get("/departments", getAllDepartments)
router.get("/hospitals", getAllHospitals)

router.get("/doctors", getAllDoctors)
router.get("/doctor/schedule/:doctorId", getDoctorSchedule)
router.get("/hospital/:id", getHospital)
router.post('/check-time', checkTimeSlot)

export default router