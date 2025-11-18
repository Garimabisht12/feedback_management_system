import React, { useState } from 'react'

import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();
 const handleAdminLogin = async(e) => {

    e.preventDefault();
    try{
      const res = await axios.post("/admin/login", {
        email,
        password

      },{ withCredentials: true }, {
    headers: {
        "Content-Type": "application/json"
    }});

    
    if (res.data ){
      navigate('/adminDashboard')
    }
    else{
        // alert('Admin Not found')
        alert(res.data)
    }
    }
    catch(e){
      console.log(e)
    }

  }




  return (
    <>
        <h1>ADMIN</h1>
        <form action="" onSubmit={handleAdminLogin}>
            <input type="email" name="email" id="email" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" name="password" id="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button>LOGIN</button>
        </form>

    </>
  )
}

export default AdminLogin


// admin@123.com admin123