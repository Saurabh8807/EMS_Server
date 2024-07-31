import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import Address from './address.model';
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    address:{
        type:Schema.Types.ObjectId,
        ref:'Address'
    },
    role:{
        type:String,
        enum:['admin','employee'],
        default:'employee'
    },
    designation:{
        type:String,
        enum:['hr','employee','javascript-backend','javascript-frontend','php','dotnet','ios'],
        default:'employee'
    },
    refreshToken: {
        type: String
    }
})

userSchema.pre('save',async(next)=>{
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next()
})

userSchema.methods.matchPassword = async (enteredPassword)=>{
    return await bcrypt.compare(this.password, enteredPassword)
}

userSchema.methods.generateAccessToken = async ()=>{
    return jwt.sign(
        {
            id:this.id,
            role:this.role,
            designation:this.designation
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = ()=>{
    return jwt.sign(
        {
            id:this.id,
            role:this.role,
            designation:this.designation
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
const User = mongoose.model('User',userSchema)

export default User;