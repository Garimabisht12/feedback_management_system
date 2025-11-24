import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'

const ViewFeedback = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/feedback/analytics')
      setAnalytics(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/adminDashboard')
  }

  const handleTeacherClick = (teacherName) => {
    navigate('/teacher', { state: { teacherName } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">View Feedbacks</h1>
              <p className="text-gray-600 mt-1">Teacher feedback overview and analysis</p>
            </div>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-700 text-lg">Loading...</p>
          </div>
        ) : (
          <>
            {/* Total Feedbacks Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-8 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Total Feedback Submitted</h3>
                  <p className="text-5xl font-bold">{analytics?.totalFeedbacks || 0}</p>
                </div>
                <svg className="w-20 h-20 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Top Teachers Section */}
            {analytics?.topTeachers && analytics.topTeachers.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Top Best Teachers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analytics.topTeachers.slice(0, 6).map((teacher, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg">{teacher.name}</h4>
                          <p className="text-green-600 font-medium">{teacher.count} votes</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Teachers List */}
            {analytics?.bestTeachersCount && Object.keys(analytics.bestTeachersCount).length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">All Teachers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(analytics.bestTeachersCount)
                    .sort(([, a], [, b]) => b - a)
                    .map(([name, count], index) => (
                      <button
                        key={index}
                        onClick={() => handleTeacherClick(name)}
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-300 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{name}</h4>
                              <p className="text-sm text-blue-600">{count} feedbacks</p>
                            </div>
                          </div>
                          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* All Comments Section */}
            {analytics?.allComments && analytics.allComments.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Student Comments</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {analytics.allComments.map((item, index) => (
                    <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                      <p className="text-gray-700 italic">"{item.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ViewFeedback