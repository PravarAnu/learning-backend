import mongoose from "mongoose";


const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Provide the coupon code"]
    },
    discount: {
        type: Number,
        required: [true, "Please provide the discount value"],
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    }
},{timestamps: true});



export default mongoose.model("Coupon", couponSchema);