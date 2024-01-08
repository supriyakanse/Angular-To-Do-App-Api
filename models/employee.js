const mongoose = require('mongoose')

const employeeSchema = mongoose.Schema({
    firstname:String,
    lastname:String,
    designation:String,
    salary:Number
})
module.exports=mongoose.model("Employee",employeeSchema)