import Razorpay from 'razorpay'
import crypto from 'crypto'
import BookingModel from '../models/BookingModel.js';
import DoctorModel from '../models/DoctorModel.js';

let instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function paymentOrder(req, res) {
    try {
        const {fees}=req.body;
        console.log(fees)
        var options = {
            amount: fees * 100,  // amount in the smallest currency unit
            currency: "INR",
        };
        instance.orders.create(options, function (err, order) {
            if (err) {
                console.log(err)
                res.json({ err: true, message: "server error" })
            } else {
                res.json({ err: false, order })
            }
        });
    } catch (error) {
        res.json({ err: true, message: "server error", error })
    }

}

export async function verifyPayment(req, res) {
    try {

        const {
            response,
            bookDate: date,
            bookTimeSlot: timeSlot,
            bookingTime: time,
            doctorId,
            hospitalId,
            fees,
            name,
            age,
            online
        } = req.body;

        let body = response.razorpay_order_id + "|" + response.razorpay_payment_id;

        var expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === response.razorpay_signature){
            const doctor = await DoctorModel.findById(doctorId);
            const booking= await BookingModel.create({
                date, timeSlot, time, payment:response, doctorId, hospitalId:doctor.hospitalId,fees,
                userId:req.user._id, patientName:name, age,online,
                token: Math.ceil(Math.random()*100000)
            })
            return res.json({
                err:false, booking
            })
        }else{
            return res.json({
                err:true, message:"payment verification failed"
            })
        }


    }catch(error){
        console.log(error)
        res.json({error, err:true, message:"somethin went wrong"})
    }

}