import 'dotenv/config';
import  express  from 'express';
import path from "path";
import cors from 'cors';
import http from "http"
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
import { Server } from "socket.io";
import socketConnect from './config/socketConnect.js'
import chatRouter from './routers/chatRouter.js'
import messageRouter from './routers/messageRouter.js'
import doctorChatRouter from './routers/doctorChatRouter.js'

const app = express();


const server = http.createServer(app);

const io = new Server(server, {
  cors: { 
    origin: ["http://localhost:3001"],  
  },
});
let activeUsers={}
socketConnect(io, activeUsers)

app.use(express.json({ limit: '50mb' }))
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.resolve() + "/public"))
app.use(
  cors({
    origin: 'https://docconnect-six.vercel.app',
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
app.use("/chat",verifyUser, chatRouter)
app.use("/doctor/chat",verifyDoctor, doctorChatRouter)
app.use("/message",verifyUser, messageRouter)
app.use("/doctor/message/",verifyDoctor, messageRouter)

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
