const mongoose = require("mongoose");
const User = require("../models/User");

const authenticate = async(req,res,next)=>{
    const {sessionid} = req.headers;
    //mongoose.isValidObjectId(_id):_id의 존재여부 확인
    //console.log(sessionid);
    if(!sessionid||!mongoose.isValidObjectId(sessionid)) return next();
    const user = await User.findOne({"sessions._id":sessionid});
    if(!user) return next();
    req.user = user;
    return next();
}

module.exports={authenticate};