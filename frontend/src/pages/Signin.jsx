import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


export const Signin = () => {
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const navigate=useNavigate();

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <div className="space-y-4 mt-4">
          <InputBox placeholder="Joe@gmail.com" label={"Email"} onChange={(e)=>{
            setUsername(e.target.value);
          }} />
          <InputBox placeholder="123456" label={"Password"} onChange={(e)=>{
            setPassword(e.target.value);
          }} />  
        </div>
        
        <div className="pt-4  flex justify-center">
          <Button title={"Sign in"}  onClick={async ()=>{
            const response =await axios.post("http://localhost:3000/api/v1/user/signin" ,{
              username,
              password
            });
            localStorage.setItem("token",response.data.token);
            navigate('/dashboard');
          }} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}