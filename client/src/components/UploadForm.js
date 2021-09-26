import React,{useState,useContext} from 'react';
import axios from 'axios';
import "./UploadForm.css";
import {toast} from "react-toastify";
import ProgressBar from './ProgressBar';
import { ImageContext } from '../context/ImageContext';

const UploadForm = ()=>{
    const {setImages}=useContext(ImageContext);
    const defaultFileName = "이미지 파일을 업로드 해주세요"
    const [files,setFiles] = useState(null);

    const [previews,setPreviews] = useState([]);

    const [percent,setPercent] = useState(0); 
    const [isPublic,setIsPublic] = useState(true);

    const onChangeInput=async(e)=>{
        const imageFiles= e.target.files;
        setFiles(imageFiles);
        console.log([...imageFiles])
        const imagePreviews =await Promise.all(
            [...imageFiles].map(imageFile=>{
                return new Promise((resolve,reject)=>{
                    try{
                        let fileReader = new FileReader(); 
                        fileReader.readAsDataURL(imageFile);
                        fileReader.onload=(e)=> resolve({imgSrc:e.target.result,fileName:imageFile.name});
                    }catch(err){
                        reject(err);
                    }
                })
            })
        );
        setPreviews(imagePreviews);
    }
    const onSubmit = async (event) =>{
        event.preventDefault();
        const formData = new FormData();
        for(let file of files) formData.append('image',file);
       
        formData.append("public",isPublic);
        try{
            const res = await axios.post("/images",formData,{
                headers:{"Content-Type":"multipart/form-data"},
                onUploadProgress:(e)=>{
                    setPercent(Math.round(100* (e.loaded/e.total)));
                }
            });
            if(isPublic)setImages( (prevImages)=>[...prevImages,...res.data])
            console.log(res.data);
            setTimeout(()=>{
                console.log(`${defaultFileName}`);
                setPercent(0);
                setPreviews([]);
            },3000);
            toast.success("sucksex!!");
        }catch(err){
            toast.error(err.response.data.message);
            setPercent(0);
            setPreviews([]);
            console.error(err);
        }
    }

    const previewImages = previews.map((preview,index)=>(
        <img 
            key={index}
            style={{width:200,height:200,objectFit:"cover"}}
            src={preview.imgSrc}
            alt=""
            className={`image-preview ${preview.imgSrc && "image-preview-show"}`}
        />
    ));

    const fileName = previews.length===0?"이미지 파일을 업로드 해주세요":previews.reduce((previews,current)=>previews+`${current.fileName}`,"")

    return (
        <form onSubmit ={onSubmit}>
            <div style={{display:"flex",flexWrap:"wrap"}}>
                {previewImages}
            </div>
            <ProgressBar percent={percent}/>
            <div className="file-dropper">
                <input multiple id="image" accept="image/*" type="file" onChange={onChangeInput}/>
                {fileName}
            </div>
            <input type="checkbox" id="public-check" onChange={()=>setIsPublic(!isPublic)} value={!isPublic}/>
            <label htmlFor="public-check">비공개</label>
          <button type="submit" style={{cursor:"pointer",width:"100%",height:40,borderRadius:"3px"}}>제출</button>
        </form> 
    )
}

export default UploadForm;