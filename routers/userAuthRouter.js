import express from 'express';
import { checkUserLoggedIn, userLogin, userLogout, userRegister, userRegisterVerify,resendOTP ,googleAuthRedirect,verifyGAuth} from '../controllers/userAuthController.js';

const router=express.Router();

router.post("/login", userLogin)
router.post("/register", userRegister)
router.post("/register/verify", userRegisterVerify)
router.post("/register/verify/resend",resendOTP)
router.get("/check", checkUserLoggedIn)
router.get("/logout", userLogout)
router.get( '/google/callback', googleAuthRedirect );
router.get( '/google/verify', verifyGAuth );



export default router