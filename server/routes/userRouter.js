const {Router, request} = require('express');
const userRouter = Router();
const User = require('../models/User');
const {hash,compare}=require('bcryptjs');
const {authenticate}=require('../middleware/authentication');
const image = require('../models/Image');
const mongoose = require('mongoose');

userRouter.post("/register",async(req,res)=>{
    try{
        console.log(req.body)
        if(req.body.password.length<6)throw new Error("비밀번호를 최소 6자 이상이르 해주세요")
        //res.status(400).json({message:"비밀번호를 최소 6자 이상이르 해주세요"})
        if(req.body.username.length<3)throw new Error("username 은 3자 이상");
        const hashedPassword = await hash(req.body.password,10);
        console.log(hashedPassword);
        const user = await new User({
            name:req.body.name,
            username:req.body.username,
            hashedPassword,
            sessions:[{createdAt:new Date()}]
        }).save();
        const session = user.sessions[0];
        res.json({message:"user registered",sessionId:session._id});
    }catch(err){
        console.log(err.message)
        res.status(400).json({message:err.message});
    }
})

userRouter.patch("/login",async(req,res)=>{
    try{
        const user = await User.findOne({username:req.body.username});
        console.log(user)
        if(!user)throw new Error("입력하신 정보가 올바르지 않습니다");
        const isValid = await compare(req.body.password,user.hashedPassword)
        if(!isValid) throw new Error("invalid information");
        user.sessions.push({createdAt:new Date()});
        const session = user.sessions[user.sessions.length-1];
        await user.save();
        res.json({message:"user validate",sessionId:session._id,name:user.name,userId:user._id})
    }catch(err){
        console.log(err.message);
        res.status(400).json({message:err.message})
    }   
})

userRouter.patch("/logout",async (req,res)=>{
    try{
        console.log(req.user);
        if(!req.user) throw new Error("invalid Session Id");
        //배열형태의 column을 업데이트 할 때 $pull 키워드를 사용
        console.log(req.headers.sessionid);
        await User.updateOne({_id:req.user.id},{pull:{_id:req.headers.sessionid}});
        res.json({message:"logged out"});
    }catch(err){
        console.log(err.message);
        res.status(400).json({message:err.message});
    }
})

userRouter.get("/me",(req,res)=>{
    try{
        console.log(req.headers.sessionid)
        if(!req.user) throw new Error("권한이 없습니다");
        res.json({message:"success",sessionId:req.headers.sessionid,name:req.user.name,userId:req.user.id})
    }catch(error){
        console.log(error.message);
        res.status(400).json({message:error.message})
    }
})

userRouter.get("/me/images",async(req,res)=>{
    try{
        const {lastId}=req.query;
        if(lastId&&!mongoose.isValidObjectId(lastId))throw new Error("invalid lastid");
        if(!req.user)throw new Error("권한이 없습니다");
        const images = await image.find(lastId?{"user._id":req.user.id,_id:{$lt:lastId}}:{"user._id":req.user.id}).sort({_id:-1}).limit(10);
        res.json({images});
    }catch(err){
        console.log(err);
        res.status(400).json({message:err.message})
    }
})

module.exports = {userRouter};