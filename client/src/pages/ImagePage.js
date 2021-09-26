import React ,{useContext,useEffect,useState} from "react";
import { useParams ,useHistory} from "react-router";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {toast} from "react-toastify";
const ImagePage =()=>{
    const history = useHistory();
    const {imageId}=useParams();
    const {images,myImages,setImages,setMyImages,}=useContext(ImageContext);
    const [me]=useContext(AuthContext);
    const image = images.find(image=>image._id===imageId)
    ||myImages.find(image=>image._id===imageId)
    const [hasLiked,setHasLiked]=useState(false);

    const updateImage = (images,image)=>[
        ...images.filter(image=>image._id!==imageId)
        ,image
    ].sort((a,b)=>new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime())
    useEffect(() => {
        if(me&&image&&image.likes.includes(me.userId)){
            setHasLiked(true);
        }
    }, [me,image])

    const onSubmit=async(e)=>{
        const result = await axios.patch(`/images/${imageId}/${hasLiked?"unlike":"like"}`)
     
        if(result.data.public){
            setImages(updateImage(images,result.data));
        }else{
            setMyImages(updateImage(myImages,result.data));
        }
        setHasLiked(!hasLiked);
    }

    const deleteHandler=async(e)=>{
        try{
            if(!window.confirm("정말 해당 이미지를 삭제 하시겠습니까?"))return;
            const resp = await axios.delete(`/images/${imageId}`);
            toast.success(resp.data.message);
            if(images)setImages(images.filter((image)=>image._id!==imageId));
            if(myImages)setMyImages(myImages.filter((image)=>image._id!==imageId));
            history.push("/");

        }catch(err){
            toast.error(err.message);
        }
    }

    if(!image) return <h2>Loading...</h2>
    return(
        <div>
            <h3>Image Page - {imageId}</h3>
            <img style={{width:'100%'}} alt={imageId} src={`http://localhost:5000/uploads/${image.key}`}/>
            <span>좋아요 {image.likes.length}</span>
            {
                me&&
                image.user._id===me.userId&&
                <button onClick={deleteHandler} style={{float:'right',marginLeft:10}}>삭제</button>
            }
            <button onClick={onSubmit} style={{float:'right'}}>{hasLiked?"좋아요 취소":"좋아요"}</button>
        </div>
    )
}

export default ImagePage;