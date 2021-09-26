import React,{useState,useContext} from "react";
import CustomInput from "../components/CustomInput";
import {toast} from "react-toastify";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router";

const RegisterPage=()=>{
    const [name,setName]=useState('');
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [passwordCheck,setPasswordCheck]=useState('');
    const [,setMe]=useContext(AuthContext);
    const history = useHistory();

    const submitHandler = async e =>{
        try{
            e.preventDefault();
            if(username.length<3)throw new Error("회원번호는 3자이상");
            if(password.length<6)throw new Error("비밀번호가 너무 짧아요 6자 이상으로 해주세요");
            if(password!==passwordCheck) throw new Error("비밀번호가 다릅니다");
            const result = await axios.post("/users/register",{name,username,password})
            console.log(result);
            toast.success('회원 가입 성공!');
            setMe({userId:result.data.userId,sessionId:result.data.sessionId,name:result.data.name});
            history.push("/");
        }catch(err){
            console.error(err);
            toast.error(err.message);
        }
    }

    return(
        <div style={{
            marginTop:100,
            maxWidth:350,
            marginLeft:"auto",
            marginRight:"auto"
        }}>
            <h3>회원가입</h3>
            <form onSubmit={submitHandler}>
                <CustomInput label={"name"} value={name} setValue={setName}/>
                <CustomInput label={"username"} value={username} setValue={setUsername}/>
                <CustomInput label={"password"} value={password} setValue={setPassword} type={"password"}/>
                <CustomInput label={"pwdCheck"} value={passwordCheck} setValue={setPasswordCheck} type={"password"}/>
                <button type="submit">회원가입</button>            
            </form>
        </div>
    )
}

export default RegisterPage;