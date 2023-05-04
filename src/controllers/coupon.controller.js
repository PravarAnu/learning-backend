import Coupon from "../models/coupon.schema";
import customError from "../utils/customError";
import asyncHandler from "../services/asyncHandler";


const createCoupon = asyncHandler( async (req, res)=>{
    const { code, discount } = req.body;

    if(!code || !discount){
        throw new customError("Please provide all the details", 400);
    }

    const coupon = await Coupon.create({
        code,
        discount
    });

    res.status(200).json({
        success: true,
        message: "Coupon created successfully",
        coupon
    })
});


const deleteCoupon = asyncHandler(async (req,res)=>{
    const {id: couponId} = req.params;

    const deletedCoupon = await Coupon.findByIdAndDelete({couponId});

    if(!deletedCoupon){
        throw new customError("There is no such coupon exists", 400);
    }

    res.status(200).json({
        success: true,
        message: "Coupon deleted successfully",
        deletedCoupon
    })
});

const updateCoupon = asyncHandler(async(req, res)=>{
    const {discount} = req.body;
    const {id:couponId} = req.params;

    const updatedCoupon = await Coupon.findByIdAndUpdate({couponId}, {discount}, {
        new: true,
        runValidators: true
    });

    if(!updatedCoupon){
        throw new customError("There is no such coupon exists", 400);
    }

    res.status(200).json({
        success: true,
        message: "Coupon updated successfully",
        updatedCoupon
    });
});

const getAllCoupon = asyncHandler(async(req,res)=>{
    const allCoupon = await Coupon.find();

    if(!allCoupon){
        throw new customError("No Coupon found", 400);
    }

    res.status(200).json({
        success: true,
        allCoupon
    });
});