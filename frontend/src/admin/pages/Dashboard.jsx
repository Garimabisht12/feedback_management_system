import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'

const Dashboard = () => {
  const [totalFeedbacks, setTotalFeedbacks] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTotalFeedbacks()
  }, [])

  const fetchTotalFeedbacks = async () => {
    try {
      const response = await axios.get('/feedback/all')
      setTotalFeedbacks(response.data.length || 0)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching feedbacks:', error)
      setLoading(false)
    }
  }

  const handleLogout = () => {
    // Clear any stored tokens or session data
    localStorage.removeItem('adminToken')
    sessionStorage.clear()
    // Redirect to admin login
    navigate('/adminLogin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f0] to-[#e8e4dc] flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(139,123,105,0.15)] p-10 max-w-4xl w-full">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#4a4238] mb-2 tracking-tight uppercase">
            Admin Dashboard
          </h1>
          <p className="text-[#8b7b69] text-base">Manage your feedback system</p>
        </div>

        {/* Stats Section */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-[#d4c5b9] to-[#b8a99a] rounded-2xl p-8 text-center shadow-[0_4px_20px_rgba(139,123,105,0.2)] transition-transform duration-300 hover:translate-y-[-5px]">
            <h3 className="text-white text-xl font-semibold mb-4">Total Feedback Submitted</h3>
            <p className="text-white text-5xl font-bold m-0">
              {loading ? 'Loading...' : totalFeedbacks}
            </p>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col gap-5">
          <button
            onClick={() => navigate('/viewFeedback')}
            className="w-full px-6 py-4 bg-gradient-to-br from-[#d4c5b9] to-[#b8a99a] text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wider shadow-[0_4px_15px_rgba(139,123,105,0.25)] hover:from-[#c4b5a6] hover:to-[#a89989] hover:translate-y-[-3px] hover:shadow-[0_6px_20px_rgba(139,123,105,0.3)] active:translate-y-[-1px]"
          >
            View Feedbacks
          </button>

          <button
            onClick={() => navigate('/manageFaculty')}
            className="w-full px-6 py-4 bg-gradient-to-br from-[#e8d5c4] to-[#d4c5b9] text-[#4a4238] border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wider shadow-[0_4px_15px_rgba(139,123,105,0.2)] hover:from-[#d8c5b4] hover:to-[#c4b5a6] hover:translate-y-[-3px] hover:shadow-[0_6px_20px_rgba(139,123,105,0.25)] active:translate-y-[-1px]"
          >
            Manage Faculty
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-6 py-4 bg-gradient-to-br from-[#f5ebe0] to-[#e8dcc8] text-[#4a4238] border-2 border-[#d4c5b9] rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wider shadow-[0_4px_15px_rgba(139,123,105,0.15)] hover:from-[#e8dcc8] hover:to-[#d4c5b9] hover:translate-y-[-3px] hover:shadow-[0_6px_20px_rgba(139,123,105,0.2)] active:translate-y-[-1px]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard