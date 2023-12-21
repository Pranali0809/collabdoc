const mongoose=require('mongoose');

const Schema=mongoose.Schema;
const documentSchema=new Schema({
    
    title:{
        type: String,
        required:true,
    },
    owner:{
        type: String,
        required:true,
    },
    
    content:{
        type: String,
    },
    associatedUsers:{
        type: [String]
    }
},{timestamps:true})
module.exports=mongoose.model('Document',documentSchema)