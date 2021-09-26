import React,{useState,useContext} from "react";
import CustomInput from "../components/CustomInput";
import axios from "axios";
import {toast} from "react-toastify";
import {AuthContext} from "../context/AuthContext";
import { useHistory } from "react-router";

const LoginPage=()=>{
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [_,setMe]=useContext(AuthContext);
    const history = useHistory();

    const loginHandler = async e =>{
        try{
            e.preventDefault();
            const result = await axios.patch("/users/login",{username,password});
            console.log(result.data);
            /* axios.defaults.headers.common.sessionid=result.data.sessionId; */
            setMe({name:result.data.name,sessionId:result.data.sessionId,userId:result.data.userId})
            toast.success("login");
            history.push("/");
        }catch(err){
            console.error(err.response);
            toast.error(err.response.data.message);
        }
    } 

    return(
        <div 
            style={{
                marginTop:100,
                maxWidth:350,
                marginLeft:"auto",
                marginRight:"auto"
        }}>
            <h3>Login</h3>    
            <form onSubmit={loginHandler}>
                <CustomInput label="회원이름" value={username} setValue={setUsername}/>
                <CustomInput label="비밀번호" type="password" value={password} setValue={setPassword}/>
                <button type="submit">로그인</button>
            </form>
        </div>
    )
};

export default LoginPage;