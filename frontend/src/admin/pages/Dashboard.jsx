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
      const response = await axios.get('/admin/feedbacks/count')
      setTotalFeedbacks(response.data.totalFeedbacks || 0)
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

  const handleUploadSubjects = () => {
    navigate('/uploadSubjects');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-4xl w-full">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight uppercase">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-base">Manage your feedback system</p>
        </div>

        {/* Stats Section */}
        <div className="mb-10">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-center shadow-lg transition-transform duration-300 hover:translate-y-[-5px]">
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
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wider shadow-lg hover:from-blue-600 hover:to-blue-700 hover:translate-y-[-3px] hover:shadow-xl active:translate-y-[-1px]"
          >
            View Feedback Analytics
          </button>

          <button
            onClick={() => navigate('/viewAllFeedbacks')}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wider shadow-lg hover:from-blue-600 hover:to-blue-700 hover:translate-y-[-3px] hover:shadow-xl active:translate-y-[-1px]"
          >
            Submitted Feedbacks
          </button>

          <button
            onClick={() => navigate('/manageFaculty')}
            className="w-full px-6 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wider shadow-lg hover:from-indigo-600 hover:to-indigo-700 hover:translate-y-[-3px] hover:shadow-xl active:translate-y-[-1px]"
          >
            Manage Faculty
          </button>

          <button
            onClick={handleUploadSubjects}
            className="w-full px-6 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wider shadow-lg hover:from-indigo-600 hover:to-indigo-700 hover:translate-y-[-3px] hover:shadow-xl active:translate-y-[-1px]"
          >
            Upload Subjects and Faculty
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-6 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 uppercase tracking-wider shadow-md hover:bg-gray-50 hover:border-gray-400 hover:translate-y-[-3px] hover:shadow-lg active:translate-y-[-1px]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard