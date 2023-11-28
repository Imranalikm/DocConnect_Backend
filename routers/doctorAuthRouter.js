import express from 'express'
import { checkDoctorLoggedIn, doctorLogin, doctorLogout,   } from '../controllers/doctorAuthController.js';

const Router = express.Router();

Router.post("/login", doctorLogin)
Router.get("/check", checkDoctorLoggedIn)
Router.get("/logout", doctorLogout)

export default Router

