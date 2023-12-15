import ChatModel from "../models/ChatModel.js";
import MessageModel from "../models/MessageModel.js";

export const createChat = async (req, res) => {
    const newChat = new ChatModel({
        members: [req.body.senderId, req.body.receiverId],
    });
    try {
        const result = await newChat.save();
        res.json({ err: false, result });
    } catch (error) {
        res.json({ err: true });
    }
};


export const userChats = async (req, res) => {
    try {
        console.log("hai")
        const chat = await ChatModel.find({
            userId: req.params.userId,
        }).populate('doctorId');
        const messages= await MessageModel.aggregate([
            {
                $group: {
                    _id: "$chatId",
                    lastMessage: { $last: "$text" }
                }
            }
        ])
        let lastMessage={}
        messages.map((item, index)=>{
            lastMessage[item._id]=item.lastMessage
        })
        res.json({ err: false, chat, lastMessage })
    } catch (error) {
        res.json({ err: true });

    }
};
export const doctorChats = async (req, res) => {
    try {
        const chat = await ChatModel.find({
            doctorId: req.params.doctorId,
        }).populate('userId');
        const messages= await MessageModel.aggregate([
            {
                $group: {
                    _id: "$chatId",
                    lastMessage: { $last: "$text" }
                }
            }
        ])
        let lastMessage={}
        messages.map((item, index)=>{
            lastMessage[item._id]=item.lastMessage
        })
        res.json({ err: false, chat, lastMessage })
    } catch (error) {
        res.json({ err: true });

    }
};

export const findChat = async (req, res) => {
    try {
        let chat = await ChatModel.findOne({
            userId: req.params.userId,
            doctorId: req.params.doctorId
        }).populate('doctorId').populate('userId')
        if (!chat) {
            chat = await ChatModel.findOneAndUpdate({
                userId: req.params.userId,
                doctorId: req.params.doctorId
            },{
                $set:{
                    userId: req.params.userId,
                    doctorId: req.params.doctorId
                }
            },{upsert:true}
            ).populate('doctorId').populate('userId')
        }
      
        res.json({ err: false, chat })
    } catch (error) {
        console.log(error)
        res.json({ err: true, message:"server error" });
    }
};