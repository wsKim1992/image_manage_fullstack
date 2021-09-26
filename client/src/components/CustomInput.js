import React from "react";

const CustomInput = ({label,value,setValue,type="text"})=>{
    const onChangeInput = e=>{
        setValue(e.currentTarget.value);
    }
    return(
        <div>
            <label>{label}</label>
            <input type={type} value={value} style={{width:"100%"}} value={value} onChange={onChangeInput}/>
        </div>
    )
}

export default CustomInput;