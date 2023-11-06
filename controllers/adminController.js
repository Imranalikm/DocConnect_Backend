import UserModel from "../models/UserModel.js";

export async function getUsers(req, res) {
    try {
      const name = req.query.name ?? "";
      let users = await UserModel.find({ name: new RegExp(name, "i") }).lean();
      res.json({ err: false, users });
    } catch (err) {
      res.json({ message: "something went wrong", error: err, err: true });
    }
  }


  export async function blockUser(req, res) {
    try {
      await UserModel.findByIdAndUpdate(req.body.id, {
        $set: { block: true },
      }).lean();
      res.json({ err: false });
    } catch (err) {
      res.json({ message: "something went wrong", error: err, err: true });
    }
  }
  


  export async function unBlockUser(req, res) {
    try {
      await UserModel.findByIdAndUpdate(req.body.id, {
        $set: { block: false },
      }).lean();
      res.json({ err: false });
    } catch (err) {
      res.json({ message: "something went wrong", error: err, err: true });
    }
  }