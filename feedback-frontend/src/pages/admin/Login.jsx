import React, { useState } from 'react'
import axios from '../../api/axios'
import { useNavigate } from 'react-router-dom'
import Logo from '../../assets/cllg.jpeg'
export function AdminLogin () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleLogin = async e => {
    try {
      e.preventDefault()
      const response = await axios.post(
        '/admin/login',
        {
          email,
          password
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (response.data?.token) {
        localStorage.setItem('adminToken', response.data.token)
        navigate('/admin/dashboard')
      }
    } catch (error) {
      alert('Login failed. Please check your credentials.')
      console.log(error)
    }
  }

  return (
    <>
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f7ff] to-[#e3f2ff] p-5'>
        <div className='bg-white rounded-2xl shadow-[0_8px_32px_rgba(59,130,246,0.15)] p-12 max-w-[440px] w-full transition-all duration-300 hover:translate-y-[-5px] hover:shadow-[0_12px_40px_rgba(59,130,246,0.2)]'>
          {/* header and logo */}

          <div className='text-center mb-10'>
            <div className='w-26 h-26 mx-auto mb-5 bg-gradient-to-br from-[#93c5fd] to-[#60a5fa] rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(59,130,246,0.3)]'>
              <img
                src={Logo}
                alt='BIAS'
                className='w-24 h-24 object-cover rounded-full'
                loading='lazy'
              />
            </div>
            <h1 className='text-3xl text-[#1e3a8a] mb-2 font-semibold tracking-tight'>
              Admin Portal
            </h1>
            <p className='text-[#60a5fa] text-[0.95rem]'>
              Sign in to access the dashboard
            </p>
          </div>

          {/* login form */}
          <form className='mb-8' onSubmit={handleLogin}>
            <div className='mb-6'>
              <label
                htmlFor='email'
                className='block mb-2 text-[#1e40af] text-sm font-medium tracking-wide'
              >
                Email Address
              </label>
              <input
                type='email'
                name='email'
                id='email'
                placeholder='admin@example.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className='w-full px-4 py-3.5 border-2 border-[#dbeafe] rounded-lg text-base text-[#1e3a8a] bg-[#f0f9ff] transition-all duration-300 focus:outline-none focus:border-[#93c5fd] focus:bg-white focus:shadow-[0_0_0_4px_rgba(147,197,253,0.1)] placeholder:text-[#93c5fd] disabled:bg-[#f0f9ff] disabled:cursor-not-allowed disabled:opacity-70'
              />
            </div>

            <div className='mb-6'>
              <label
                htmlFor='password'
                className='block mb-2 text-[#1e40af] text-sm font-medium tracking-wide'
              >
                Password
              </label>
              <input
                type='password'
                name='password'
                id='password'
                placeholder='Enter your password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className='w-full px-4 py-3.5 border-2 border-[#dbeafe] rounded-lg text-base text-[#1e3a8a] bg-[#f0f9ff] transition-all duration-300 focus:outline-none focus:border-[#93c5fd] focus:bg-white focus:shadow-[0_0_0_4px_rgba(147,197,253,0.1)] placeholder:text-[#93c5fd] disabled:bg-[#f0f9ff] disabled:cursor-not-allowed disabled:opacity-70'
              />
            </div>

            {/* {error && (
          <div className='bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-4 py-3 rounded-lg mb-5 text-sm text-center'>
            {error}
          </div>
        )} */}

            <button
              type='submit'
              className='w-full px-4 py-4 bg-gradient-to-br from-[#93c5fd] to-[#60a5fa] text-white border-none rounded-lg text-[1.05rem] font-semibold cursor-pointer transition-all duration-300 tracking-wider uppercase shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:bg-gradient-to-br hover:from-[#d1fa60] hover:to-[#3bf670] hover:translate-y-[-2px] hover:shadow-[0_6px_16px_rgba(59,130,246,0.4)] active:translate-y-0 active:shadow-[0_2px_8px_rgba(59,130,246,0.3)] disabled:bg-gradient-to-br disabled:from-[#bfdbfe] disabled:to-[#93c5fd] disabled:cursor-not-allowed disabled:transform-none'
            >
              Login
              {/* {loading ? 'Signing in...' : 'Sign In'} */}
            </button>
          </form>

          {/* back button */}
          <div className='mt-6'>
            <button
              type='button'
              onClick={() => window.history.back()}
              className='w-full px-4 py-3 bg-gray-200 text-gray-800 border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-300 hover:translate-y-[-2px] active:translate-y-0'
            >
              ← Back
            </button>
          </div>

          {/* footer */}
          <div className='text-center pt-5 border-t border-[#dbeafe]'>
            <p className='text-[#60a5fa] text-[0.85rem] m-0'>
              © 2025 Feedback Management System
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
