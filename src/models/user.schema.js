import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles.utils";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import config from "../config/index.config";
import crypto from "crypto";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required:[true, "Provide the name"],
        maxLength:[50, "Name of user cannot be more than 50 characters"]
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required:[true, "Provide the password"],
        minLength: [8, "Password must be at least 8 characters"],
        select: false
    },
    role: {
        type: String,
        enum: Object.values(AuthRoles),
        default: AuthRoles.USER
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date
},{timestamps:true});

//middleware
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10);

    next();
});


// .methods are used to create some extra functionality for a particular schema
userSchema.methods = {
    // Compare Password
    comparePassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password)
    },

    getJWTtoken: function(){
        JWT.sign({_id: this._id}, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRY
        })
    },

    generateForgotPasswordToken: function(){
        const forgotToken = crypto.randomBytes(20).toString("hex");

        this.forgotPasswordToken = crypto.createHash("sha256").update(forgotToken).digest("hex");

        this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

        return forgotToken;
    }

}

export default mongoose.model("User", userSchema);