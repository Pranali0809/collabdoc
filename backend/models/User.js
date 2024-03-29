const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const userSchema=new Schema({
    uid:{
        type: String,
        required:true,
    },
    email:{
        type: String,
        required:true,
    },
    password:{
        type: String,
        required: true,
    },
    documents:{
        type: [String]
    }
},{timestamps:true})

module.exports=mongoose.model('User',userSchema)