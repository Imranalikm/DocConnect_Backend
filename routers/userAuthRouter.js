import express from 'express';
import { checkUserLoggedIn, userLogin, userLogout, userRegister, userRegisterVerify,resendOTP } from '../controllers/userAuthController.js';

const router=express.Router();

router.post("/login", userLogin)
router.post("/register", userRegister)
router.post("/register/verify", userRegisterVerify)
router.post("/register/verify/resend",resendOTP)
router.get("/check", checkUserLoggedIn)
router.get("/logout", userLogout)




export default router