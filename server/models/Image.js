const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    user:{
        _id:{type:mongoose.Types.ObjectId,required:true,index:true},
        name:{type:String,required:true},
        username:{type:String,required:true}
    },
    likes:[{type:mongoose.Types.ObjectId}],
    public:{type:Boolean,required:true,default:false},
    key:{type:String,required:true},
    originalFileName:{type:String,required:true},
},{
    timestamps:true,//createdAt 과 updatedAt이 자동으로 생성됨
});

module.exports = mongoose.model("image",ImageSchema);