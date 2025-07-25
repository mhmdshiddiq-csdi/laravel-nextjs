"use client"
import { myAppHook } from "@/context/AppProvider";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface formData {
  name?: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState<formData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  })
  const {login, register} = myAppHook()
  const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e?.target.name]: e?.target.value
    })
  }
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      try {
        await login(formData.email, formData.password)
      }catch (error) {
        console.log(error)
      }
    } else {
      try {
        await register(formData.name!, formData.email, formData.password, formData.password_confirmation!)
      }catch (error) {
        console.log(error)
      }
    }
  }
  
  return (
   <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4" style={{width: "400px;"}} >
        <h3 className="text-center">{isLogin ? 'Login' : 'Register'}</h3>
            <form onSubmit={handleFormSubmit}>
          {
            !isLogin && (
                <input className="form-control mb-2" name="name" type="text" placeholder="Name" required value={formData.name} onChange={handleOnChangeInput}/>
            )  
          }
                <input className="form-control mb-2" name="email" type="email" placeholder="Email" required value={formData.email} onChange={handleOnChangeInput}/>
                <input className="form-control mb-2" name="password" type="password" placeholder="Password" required value={formData.password} onChange={handleOnChangeInput}/>
                { 
              !isLogin && (
                  <input className="form-control mb-2" name="password_confirmation" type="password" placeholder="Confirm Password" required value={formData.password_confirmation} onChange={handleOnChangeInput}/>
                  )
                }
                <button className="btn btn-primary w-100" type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>

        <p className="mt-3 text-center">
            {isLogin ? 'Don\'t have an account?' : 'Already have an account?'} {' '}
          <span onClick={() => setIsLogin(!isLogin)} style={{cursor: 'pointer'}}>
            {isLogin ? "Register" : "Login"}
            </span>
            </p>
        </div>
    </div>
  )
}

export default Auth