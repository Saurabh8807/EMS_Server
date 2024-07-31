import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

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
    role:{
        type:String,
        enum:['admin','employee'],
        default:'employee'
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

const User = mongoose.model('User',userSchema)

export default User;