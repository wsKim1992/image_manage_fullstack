const express =require('express');
const mongoose = require('mongoose');
const Image = require("./models/Image")
const {imageRouter} = require("./routes/imageRouter");
const {userRouter} = require("./routes/userRouter");
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const path = require('path');
const PORT = process.env.PORT||5000;
const {authenticate}=require("./middleware/authentication")

mongoose.connect(
    process.env.MONGO_URI,
).then(()=>{
    app.use(express.json())
    console.log("MongoDB Connected.");
    app.use('/uploads',express.static(path.resolve('./uploads')));
    app.use(authenticate)
    app.use("/images",imageRouter)
    app.use("/users",userRouter);
    app.listen(PORT,()=>console.log(`Express server listening on PORT ${PORT}`));    
}).catch(err=>console.error(err));
