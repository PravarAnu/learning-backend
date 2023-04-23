import asyncHandler from "../services/asyncHandler.js"
import customError from "../utils/customError.js"
import User from "../models/user.schema.js"

const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 ),
    httpOnly: true
}

const SignUp = asyncHandler( async (req, res)=>{
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