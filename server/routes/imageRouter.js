const {Router}=require('express')
const imageRouter = Router();
const Image = require('../models/Image');
const {upload} = require('../middleware/ImageUpload');
const fs = require('fs');
const {promisify} =require("util");
const mongoose = require("mongoose");

const fileunlink=promisify(fs.unlink);
//upload.single('fieldname'): 1개의 파일만 업로드
//upload.array('fieldname',numOfFiles)
imageRouter.post('/',upload.array('image',5),async (req,res)=>{
    try{
        if(!req.user)throw new Error("권한이 없습니다.");
        const images = await Promise.all(
            req.files.map(async (file)=>{
                const image = await new Image({
                    user:{
                        _id:req.user.id,
                        name:req.user.name,
                        username:req.user.username
                    },
                    public:req.body.public,
                    key:file.filename,
                    originalFileName:file.originalname
                }).save();
                return image;
            })
        )
        
        res.json(images);
    }catch(err){
        console.log(err);
        res.status(400).json({message:err.message})
    }
})


imageRouter.get('/', async (req,res)=>{
    try{
        const {lastId}=req.query;
        console.log(`Query : ${JSON.stringify(req.query)}`);
        if(lastId&&!mongoose.isValidObjectId(lastId)) throw new Error("invalid lastId");
        const images = await Image.find(lastId?{
            public:true,
            _id:{$lt:lastId}
        }:{public:true}).limit(10).sort({_id:-1});
        //limit(limitNumber) 를 통해 limitNumber만큼의 data만 추출함
        //$lt: less than $gt : greater than
        //sort({standard_column:1}) standard_column 기준으로 정렬 : -1 : 거꾸로, 1 : 제대로 정렬 
        res.json({images});
    }catch(err){
        console.log(err);
        res.status(400).json({message:err.message});
    }
})

imageRouter.delete("/:imageId",async (req,res)=>{
    try{
        if(!req.user)throw new Error("권한없음 ㅇㅅㅇ");
        const imageId=req.params.imageId;
        if(!mongoose.isValidObjectId(imageId))
            throw new Error("올바르지 않는 이미지 아이디다 이기야!");
        const image = await Image.findOneAndDelete({_id:imageId});
        if(image){return res.json({message:"이미 삭제된 이미지임 ㅇㅅㅇ"})}
        await fileunlink(`./uploads/${image.key}`);
        res.json({message:"이미지 삭제됨 ㅇㅇ"});
    }catch(err){
        console.log(err);
        res.status(400).json({message:err.message});
    }
})

imageRouter.patch("/:imageId/like",async(req,res)=>{
    try{
        if(!req.user)throw new Error("권한이 없습니다");
        console.log(req.params.imageId);
        if(!mongoose.isValidObjectId(req.params.imageId)) throw new Error("올바르지 않은 이미지 아이디")
        let image = await Image.findOneAndUpdate({_id:req.params.imageId},
            {$addToSet:{likes:req.user.id}},
            {new:true});//update 되고 나서의 객체를 얻기 위해 option에 new:true 를 해줌.
        console.log(image.likes);
        res.json(image);
    }catch(err){
        console.log(err);
        res.status(400).json({message:err.message});
    }
})

imageRouter.patch("/:imageId/unlike",async(req,res)=>{
    try{
        if(!req.user)throw new Error("권한이 없습니다");
        if(!mongoose.isValidObjectId(req.params.imageId)) throw new Error("올바르지 않은 이미지 아이디")
        let image = await Image.findOneAndUpdate({_id:req.params.imageId},
            {$pull:{likes:req.user.id}},
            {new:true});//update 되고 나서의 객체를 얻기 위해 option에 new:true 를 해줌.
        console.log(image.likes);
        res.json(image);
    }catch(err){
        console.log(err);
        res.status(400).json({message:err.message});
    }
})

module.exports = {imageRouter};