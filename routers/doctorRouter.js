import express from 'express'
import {  editDoctorProfile,  getDoctorProfile,getDoctorBookings,addEMR,getEMR,getDoctorTodayBookings,getDoctorSchedule} from '../controllers/doctorController.js';

const Router = express.Router();


Router.patch('/profile', editDoctorProfile)
Router.get("/profile", getDoctorProfile)
Router.get('/bookings', getDoctorBookings)
Router.get('/booking/today', getDoctorTodayBookings)
Router.get("/schedule", getDoctorSchedule)
Router.post('/emr', addEMR)
Router.get('/emr/:bookingId', getEMR)


export default Router