// StudentLogin.jsx

/* eslint-disable no-unused-vars */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../assets/cllg.jpeg'
import axios from '../../api/axios'

export function StudentLogin () {

  const [rollNo, setRollNo] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/', true)
  }

  const handleLogin = async e => {

    e.preventDefault()

    try {

      const response = await axios.post(
        '/student/login',
        {
          rollNo,
          password
        }
      )

      const student = response.data.student || {}

      if (response.data.token) {
        localStorage.setItem(
          'studentToken',
          response.data.token
        )
      }

      const statusRes = await axios.get('/student/feedback/status')

      if (statusRes.data?.submitted) {
        navigate('/responded')
      } else {
        navigate(
          '/feedbackForm',
          {
            state: student
          }
        )
      }

    } catch (e) {

      alert(
        e.response?.data?.message ||
        'Login failed. Please check your credentials and try again.'
      )

    }

  }

  return (
    <>
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f7ff] to-[#e3f2ff] p-5'>

        <div className='bg-white rounded-2xl shadow-[0_8px_32px_rgba(59,130,246,0.15)] p-12 max-w-[440px] w-full'>

          <div className='text-center mb-10'>

            <div className='w-26 h-26 mx-auto mb-5 bg-gradient-to-br from-[#93c5fd] to-[#60a5fa] rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(59,130,246,0.3)]'>
              <img
                src={Logo}
                alt='Logo'
                className='w-24 h-24 object-cover rounded-full'
              />
            </div>

            <h1 className='text-3xl text-[#1e3a8a] mb-2 font-semibold'>
              Student Portal
            </h1>

            <p className='text-[#60a5fa] text-[0.95rem]'>
              Enter your roll number to continue
            </p>

          </div>

          <form onSubmit={handleLogin}>

            <div className='mb-6'>

              <label className='block mb-2 text-sm font-medium'>
                Roll Number
              </label>

              <input
                type='number'
                value={rollNo}
                onChange={e => setRollNo(e.target.value)}
                placeholder='Enter Roll Number'
                required
                className='w-full px-4 py-3 border-2 border-[#dbeafe] rounded-lg'
              />

            </div>

            <div className='mb-6'>

              <label className='block mb-2 text-sm font-medium'>
                Password
              </label>

              <input
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Enter Password'
                required
                className='w-full px-4 py-3 border-2 border-[#dbeafe] rounded-lg'
              />

            </div>

            <button
              type='submit'
              className='w-full px-4 py-4 bg-gradient-to-br from-[#93c5fd] to-[#60a5fa] text-white rounded-lg font-semibold'
            >
              Login
            </button>

          </form>

          <div className='mt-6'>

            <button
              type='button'
              onClick={handleBack}
              className='w-full px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold'
            >
              ← Back
            </button>

          </div>

        </div>

      </div>
    </>
  )

}