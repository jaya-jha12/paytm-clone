import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { useNavigate } from 'react-router-dom'
import axios from "axios";

export const Signup=()=>{
    const [firstname,setFirstname]=useState("");
    const [lastname,setLastname]=useState("");
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const navigate= useNavigate();

    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign up"} />
                <SubHeading label={"Enter the required information for forming account"} />
                <div className="space-y-4 pt-4">
                    <InputBox label={"First name"} placeholder={"Joe"} onChange={(e)=>{
                        setFirstname(e.target.value);
                    }} />
                    <InputBox label={"Last name"} placeholder={"Luther"} onChange={(e)=>{
                        setLastname(e.target.value);
                    }} />
                    <InputBox label={"Email"} placeholder={"Joe@gmail.com"} onChange={(e)=>{
                        setUsername(e.target.value);
                    }} />
                    <InputBox label={"Password"} placeholder={"abcd.."} onChange={(e)=>{
                        setPassword(e.target.value);
                    }} />
                </div>
                
                <div className="pt-4">
                    <div className="w-32 mx-auto">
                        <Button title={"Sign Up"} onClick={async ()=>{
                            const response =await axios.post("http://localhost:3000/api/v1/user/signup",{
                                username,
                                firstname,
                                lastname,
                                password
                            });
                            localStorage.setItem("token",response.data.token);
                            navigate('/dashboard');
                        }}  />
                    </div>
                    
                </div>
                <BottomWarning label={"Already have an account ?"} buttonText={"Sign in"} to={"/signin"} />  
            </div>
        </div>
    </div>
}