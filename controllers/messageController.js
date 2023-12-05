import MessageModel from "../models/MessageModel.js";

export const addMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;
    const message = new MessageModel({
      chatId,
      senderId,
      text,
    });
    try {
      const result = await message.save();
      res.json({err:false, result});
    } catch (error) {
      res.json({err:true})
    }
  };

  export const getMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
      const result = await MessageModel.find({ chatId });
      res.json({err:false, result});
    } catch (error) {
        res.json({err:true})
    }
  };