import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
// import Address from './address.model';
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone:{
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: "Address",
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
  },
  designation: {
    type: Schema.Types.ObjectId,
    ref: "Designation",
  },
  teamLead:{
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  isTeamLead:{
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
    required: true,
  },
  marital_status: {
    type: String,
    required: true,
  },

  joining_date: {
    type: Date,
    default: Date.now,
  },

  date_of_birth: {
    type: Date,
    default: Date.now,
  },

  refreshToken: {
    type: String,
  },
},{timestamps: true});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next()
})

userSchema.methods.matchPassword = async function(enteredPassword){
 
    return await bcrypt.compare(enteredPassword, this.password )
}

userSchema.methods.generateAccessToken = async function(){
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

userSchema.methods.generateRefreshToken = async function(){
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