import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../api/axios";






const StudentLogin = () => {
  const [rollNo, setRollNo] = useState('');
  const [isError, setIsError] = useState(false)
  const navigate = useNavigate();
const [alreadySubmitted, setAlreadySubmitted] = useState(false)
const checkSubmission = async () => {
    try {
      const res = await axios.get(`/feedback-status/${rollNumber}`);
      if (res.data.submitted) {
        setAlreadySubmitted(true);
      }
    } catch (err) {
      console.error("Error checking feedback status", err);
    }
  };



  const handleLogin = async(e) => {
    e.preventDefault();
    try{
      const res = await axios.post("/login", {
        rollNo
      }, {
    headers: {
        "Content-Type": "application/json"
    }});

    
    checkSubmission();
    
    // console.log(res)
    if (alreadySubmitted ){
      navigate('/responded')
    }
      else{
      navigate('/FeedbackForm', { state: { rollNo } });
      }
      
      
    }
    catch(e){
      setIsError(true)
      console.log(e)
    }

  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Student Login</h1>
      <div className="bg-white shadow-lg rounded-xl p-8 w-80">
        <form action=" " onSubmit={handleLogin}>
          <label htmlFor="rollNo">
              <input type="text" onChange={e => setRollNo(e.target.value)} value={rollNo} className=' w-full my-5' name="rollNo" id="rollNo" placeholder='Enter Your Roll No.' required />

            </label>
        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all">
          Login
        </button>
        </form>
        {
          isError && <p className='text-red-500'>Error Found</p>
        }
      </div>
    </div>
  );
};

export default StudentLogin;