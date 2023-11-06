import express from 'express'
import { checkHospitalLoggedIn, hospitalLogin,  hospitalRegister,hospitalLogout} from '../controllers/hospitalAuthController.js';

const Router = express.Router();

Router.post("/register", hospitalRegister)
Router.post("/login", hospitalLogin)
Router.get("/check", checkHospitalLoggedIn)
Router.get("/logout", hospitalLogout)






export default Router