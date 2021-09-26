import React,{useContext} from "react";
import ImageList from "../components/ImageList";
import UploadForm from "../components/UploadForm";
import {AuthContext} from "../context/AuthContext";

const MainPage=()=>{
    const [me]=useContext(AuthContext)
    return(
        <div>
            <h3>MainPage</h3>
            {me&&<UploadForm/>}
            <ImageList/>
        </div>
    )
}

export default MainPage;