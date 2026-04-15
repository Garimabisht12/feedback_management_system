/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../assets/cllg.jpeg'
import axios from '../../api/axios'
export function StudentLogin () {
  const [rollNo, setRollNo] = useState('')
  const navigate = useNavigate()
  const handleBack = () => {
    navigate('/', true)
  }

  const handleLogin = async e => {
    e.preventDefault()
    try {
      const response = await axios.post('/login', {
        rollNo
      })
    if (!response.data.student.hasSubmittedFeedback) { 
      navigate('/feedbackForm', { state: rollNo })
    }
else{
  navigate('/responded')
}    } catch (e) {
      console.log(e)
      alert(e)
    }
  }
  return (
    <>
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f7ff] to-[#e3f2ff] p-5'>
        <div className='bg-white rounded-2xl shadow-[0_8px_32px_rgba(59,130,246,0.15)] p-12 max-w-[440px] w-full transition-all duration-300 hover:translate-y-[-5px] hover:shadow-[0_12px_40px_rgba(59,130,246,0.2)]'>
          <div className='header text-center mb-10'>
            <div className='header-logo w-26 h-26 mx-auto mb-5 bg-gradient-to-br from-[#93c5fd] to-[#60a5fa] rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(59,130,246,0.3)]'>
              <img
                src={Logo}
                alt='BIAS Logo'
                className='w-24 h-24 object-cover rounded-full'
                loading='lazy'
              />
            </div>
            <h1 className='header-text text-3xl text-[#1e3a8a] mb-2 font-semibold tracking-tight'>
              Student Portal
            </h1>
            <p className='header--sub-text text-[#60a5fa] text-[0.95rem]'>
              Enter your roll number to continue
            </p>
          </div>
          <div className='form'>
            <form onSubmit={handleLogin} className='mb-6'>
              <div className='mb-6'>
                <label
                  htmlFor='rollNo'
                  className='block mb-2 text-[#1e40af text-sm font-medium tracking-wide'
                >
                  Roll Number
                </label>
                <input
                  type='number'
                  name='rollNo'
                  id='rollNo'
                  value={rollNo}
                  onChange={e => setRollNo(e.target.value)}
                  placeholder='XXXXXXXXX50987'
                  required
                  className='w-full px-4 py-3.5 border-2 border-[#dbeafe] rounded-lg text-base text-[#1e3a8a] bg-[#f0f9ff] transition-all duration-300 focus:outline-none focus:border-[#93c5fd] focus:bg-white focus:shadow-[0_0_0_4px_rgba(147,197,253,0.1)] placeholder:text-[#93c5fd] disabled:bg-[#f0f9ff] disabled:cursor-not-allowed disabled:opacity-70'
                />
              </div>

              {/* {isError && (
                        <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-4 py-3 rounded-lg mb-5 text-sm text-center">
                        Invalid roll number. Please try again.
                        </div>
                        )} */}

              <button
                type='submit'
                className='w-full px-4 py-4 bg-gradient-to-br from-[#93c5fd] to-[#60a5fa] text-white border-none rounded-lg text-[1.05rem] font-semibold cursor-pointer transition-all duration-300 tracking-wider uppercase shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:bg-gradient-to-br hover:from-[#d1fa60] hover:to-[#3bf670] hover:translate-y-[-2px] hover:shadow-[0_6px_16px_rgba(59,130,246,0.4)] active:translate-y-0 active:shadow-[0_2px_8px_rgba(59,130,246,0.3)] disabled:bg-gradient-to-br disabled:from-[#bfdbfe] disabled:to-[#93c5fd] disabled:cursor-not-allowed disabled:transform-none'
              >
                Login
              </button>
            </form>
          </div>
          <div className='navigate-back mt-6'>
            <button
              type='button'
              onClick={handleBack}
              className='w-full px-4 py-3 bg-gray-200 text-gray-800 border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:translate-y-[-2px] active:translate-y-0'
            >
              ← Back
            </button>
          </div>
          <div className='footer text-center pt-5 border-t border-[#dbeafe]'>
            <p className='text-[#60a5fa] text-[0.85rem] m-0'>
              © 2026 Feedback Management System
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
