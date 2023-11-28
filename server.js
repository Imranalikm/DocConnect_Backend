import 'dotenv/config';
import  express  from 'express';
import path from "path";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dbConnect from './config/dbConnect.js';
import userAuthRouter from './routers/userAuthRouter.js'
import adminAuthRouter from './routers/adminAuthRouter.js'
import adminRouter from './routers/adminRouter.js'
import userRouter from './routers/userRouter.js'
import verifyAdmin from './middlewares/verifyAdmin.js'
import hospitalAuthRouter from './routers/hospitalAuthRouter.js'
import hospitalRouter from './routers/hospitalRouter.js'
import verifyHospital from './middlewares/verifyHospital.js';
import verifyUser from './middlewares/verifyUser.js'
import doctorAuthRouter from './routers/doctorAuthRouter.js'
import doctorRouter from './routers/doctorRouter.js'
import verifyDoctor from './middlewares/verifyDoctor.js';

const app = express();

app.use(express.json({ limit: '50mb' }))
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.resolve() + "/public"))
app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true, // Allow sending cookies with the request
  })
);

dbConnect();

app.get("/", (req, res)=>res.send("app running successfully..."))
app.use("/user/auth/", userAuthRouter)
app.use("/admin/auth/", adminAuthRouter)
app.use("/admin/", verifyAdmin, adminRouter)
app.use("/hospital/auth/", hospitalAuthRouter)
app.use("/hospital/", verifyHospital, hospitalRouter)
app.use("/user/",verifyUser, userRouter)
app.use("/doctor/auth/",doctorAuthRouter)
app.use("/doctor/", verifyDoctor, doctorRouter)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
