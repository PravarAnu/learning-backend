import asyncHandler from "../services/asyncHandler.js";
import customError from "../utils/customError.js";
import User from "../models/user.schema.js";

import mailHelper from "../utils/mailHelper.js"

const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 ),
    httpOnly: true
}

export const SignUp = asyncHandler( async (req, res)=>{
    const {name, email, password} = req.body;

    if(!name||!email||!password ){
        throw new customError("Please provide the user details", 400)
    }

    const userExictence = await User.findOne({email});

    if(userExictence){
        throw new customError("User is already exist", 400);
    }

    const user = User.create({
        name,
        email,
        password
    })

    const token = user.getJWTtoken();

    //For sending back the status to the client for succesfull creation of user we just set the password part undefined for not showing the password
    user.password = undefined;

    // store the tokn in the user's cookie
    res.cookie("token", token, cookieOptions)

    res.status(200).json({
        success: true,
        token,
        user
    })
}) 

export const LogIn = asyncHandler( async (req, res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        throw new customError("Please provide all the credentials", 400);
    }


    const user = User.findOne({email}).select("+password");

    if(!user){
        throw new customError("Invalid credentials", 400);
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(isPasswordMatched){
        const token = user.getJWTtoken();
        user.password = undefined;

        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            success: true,
            token,
            user
        })
    }
    else{
        throw new customError("Password is incorrect", 400);
    }

})

export const LogOut = asyncHandler( async (req, res)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });


    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})

export const getProfile = asyncHandler( async (req, res)=>{
    const {id: userId} = req.body;


    if(!userId){
        throw new customError("Please provide id of the user",400)
    }

    const profile = User.findById(userId);

    if(!profile){
        throw new customError("User not found", 400);
    }

    res.status(200).json({
        success: true,
        profile
    })
})

export const forgotPassword = asyncHandler( async(req, res)=>{
    const { email } = req.body;

    if(!email){
        throw new customError("Please provide the email", 400)
    }

    const user = await User.find({email});

    if(!user){
        throw new customError("User not found", 404);
    }

    const resetToken = user.generateForgotPasswordToken();

    await user.save({validateBeforeSave: false});

    const resetUrl = `${req.protocol}://${req.get("host")}//api/v1/auth/password/reset/?token=${resetToken}`

    const message = `This is your password reset token \n\n ${resetUrl} \n\n If this is not requested by you, please ignore.`


    try {
        await mailHelper({
            email: user.email,
            subject: "Password Reset Link",
            message 
        })
    } catch (error) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;

        await user.save({validateBeforeSave: false});

        throw new customError(error.message || "Email can't be send now", 500);
    }
})

export const resetPassword = asyncHandler(async(req, res)=> {
    const {token: resetToken} = req.params;

    const {password, confirmPassword} = req.body;

    if(password !== confirmPassword){
        throw new customError("Password didn't matched", 400);
    }

    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    const user = await User.findOne({
        forgotPasswordToken: resetPasswordToken,
        forgotPasswordExpiry: {$gt : Date.now()}
    });

    if(!user){
        throw new customError("Password reset token is invalid or expired", 400);
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    const token = user.getJWTtoken();
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
        success: true,
        user
    })
})