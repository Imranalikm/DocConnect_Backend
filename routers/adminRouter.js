import express from 'express'
import { blockUser, getUsers,  unBlockUser } from '../controllers/adminController.js';

const Router = express.Router();



Router.get("/users", getUsers)
Router.patch("/user/block", blockUser)
Router.patch("/user/unblock", unBlockUser)


export default Router