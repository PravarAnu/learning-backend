import asyncHandler from "../services/asyncHandler.js"
import customError from "../utils/customError.js"
import User from "../models/user.schema.js"

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