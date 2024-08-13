import mongoose from 'mongoose'

const designationSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    employeeCount:{
        type:Number,
        required:true
    }

},{timestamps: true})

const Designation = mongoose.model('Designation',designationSchema)

export default Designation