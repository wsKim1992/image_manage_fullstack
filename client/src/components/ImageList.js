import React,{useState,useContext,useRef, useEffect,useCallback} from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {ImageContext} from "../context/ImageContext"
import "./ImageList.css";
const ImageList = ()=>{
    const {
        images,
        isPublic,
        setIsPublic,
        imageLoading,
        imageError,
        setImageUrl,
    } = useContext(ImageContext);
    const [me]=useContext(AuthContext);
    const elementRef = useRef(null);

    const loaderMoreImages =useCallback(()=>{
        if(imageLoading||imageLoading) return;
        const lastImageId = images.length>0? images[images.length-1]._id:null;
        setImageUrl(`${isPublic?"":"/users/me"}/images?lastId=${lastImageId}`)
    },[images,imageLoading,isPublic,setImageUrl])

    useEffect(()=>{
        if(!elementRef.current)return;
        const observer = new IntersectionObserver(([entry])=>{
            console.log(entry);
            console.log(`intersection : ${entry.isIntersecting}`);
            if(entry.isIntersecting)loaderMoreImages();
        });
        //IntersectionObserver : 특정 요소가 브라우져 화면에 들어왔는지 여부를 감지(observe)
        observer.observe(elementRef.current);
        //loaderMoreImages 가 변경될 때 마다 이 useEffect 함수가 실행되는데
        //실행 될 떄 마다 새로운 observer 객체가 생성이 되면서 불러왔던 이미지를 
        //다시 불러오게된다. 이를 방지하기 위해 새로 useEffect 내부 콜백이 호줄 될 떄
        // return 을 통해 observer 객체의 연결을 해제한다.
        return ()=>observer.disconnect();
    },[loaderMoreImages])

    const imgList = images.map((image,index)=>(
        <Link key={image.key} to={`/images/${image._id}`} ref={index+1===images.length?elementRef:undefined}>
            <img alt="" src={`http://localhost:5000/uploads/${image.key}`}/>
        </Link>
    ))
    return (
        <div>
            <h3 style={{display:"inline-block",marginRight:10}}>이미지 리스트 ({isPublic?"공개":"개인"}사진)</h3>
            {me&&<button onClick={()=>setIsPublic(prevIsPublic=>!prevIsPublic)}>
                {(isPublic?"개인":"공개")+"사진 보기"}
            </button>}
            <div className="image-list-container">{imgList}</div>
            {imageError&&<div>Error...</div>}
            {imageLoading?(<div>Loading</div>):(<button onClick={loaderMoreImages}>Load More Images</button>)}
        </div>
    )
}

export default ImageList;