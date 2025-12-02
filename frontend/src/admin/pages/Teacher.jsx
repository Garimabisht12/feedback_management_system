import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '../../api/axios'

const feedbackParams = [
  { sNo: 1, parameter: "Teacher's Voice Skill" },
  { sNo: 2, parameter: "Systematic delivery" },
  { sNo: 3, parameter: "Teacher's behaviour" },
  { sNo: 4, parameter: "Interaction with students/Inactiveness in class" },
  { sNo: 5, parameter: "Teacher's command over the subject" },
  { sNo: 6, parameter: "Discussion on question/example" },
  { sNo: 7, parameter: "Teacher's punctuality" },
  { sNo: 8, parameter: "Teacher's ability to control class" },
  { sNo: 9, parameter: "Teacher's accessibility & help outside the class" },
];

const Teacher = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const teacher = location.state?.teacher
  const teacherName = location.state?.teacher?.teacherName || location.state?.teacherName || ''

  useEffect(() => {
    if (teacher) {
      // Use passed teacher data directly
      setAnalytics(teacher)
      setLoading(false)
    } else if (teacherName) {
      // Fallback: fetch if only name is provided
      fetchTeacherAnalytics()
    }
  }, [teacherName, teacher])

  const fetchTeacherAnalytics = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/feedback/teacher/${encodeURIComponent(teacherName)}`)
      setAnalytics(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching teacher analytics:', error)
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/viewFeedback')
  }

  // Bar Chart Component
  const BarChart = ({ data, title, valueKey = 'average', maxValue = 5 }) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4']
    
    // Filter to show only first 9 parameters
    const filteredData = data.slice(0, 9)

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <div className="space-y-4">
          {filteredData.map((item, index) => {
            const isPrimitive = typeof item === 'number' || typeof item === 'string'
            const numericValue = isPrimitive
              ? Number(item)
              : (item?.[valueKey] ?? item?.average ?? item?.value ?? null)

            // Use parameter name from feedbackParams array
            const label = !isPrimitive
              ? (item.parameter || feedbackParams[index]?.parameter || `Parameter ${index + 1}`)
              : feedbackParams[index]?.parameter || `Parameter ${index + 1}`

            const pct = (numericValue != null && !Number.isNaN(numericValue))
              ? Math.max(0, Math.min(100, (numericValue / maxValue) * 100))
              : 0

            return (
              <div key={index} className="flex items-center gap-4">
                <div className="w-64 text-sm font-medium text-gray-700 truncate" title={label}>
                  {label}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: colors[index % colors.length]
                    }}
                  >
                    <span className="text-xs font-semibold text-white">
                      {numericValue != null && !Number.isNaN(numericValue) ? numericValue.toFixed(2) : '-'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (!teacherName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 text-lg mb-4">No teacher selected</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{teacherName}</h1>
              <p className="text-gray-600">Teacher Performance Analysis</p>
            </div>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
            >
              Back to Feedbacks
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-700 text-lg">Loading Teacher Analytics...</p>
          </div>
        ) : analytics ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Total Feedbacks</h3>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-4xl font-bold">{analytics.totalFeedbacks || 0}</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Best Teacher Votes</h3>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-4xl font-bold">{analytics.bestTeacherVotes || 0}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Overall Rating</h3>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-4xl font-bold">{analytics.averageRating?.toFixed(2) || 0}/5</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Avg Syllabus</h3>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </div>
                <p className="text-4xl font-bold">{analytics.avgSyllabus?.toFixed(1) || 0}/10</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Voice Skills</h3>
                <p className="text-3xl font-bold text-purple-600">{analytics.avgVoice?.toFixed(1) || 0}/10</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Regularity</h3>
                <p className="text-3xl font-bold text-green-600">{analytics.avgRegularity?.toFixed(1) || 0}/10</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Syllabus Coverage</h3>
                <p className="text-3xl font-bold text-orange-600">{analytics.avgSyllabus?.toFixed(1) || 0}/10</p>
              </div>
            </div>

            {/* Parameter-wise Ratings */}
            {analytics.parameterAverages && analytics.parameterAverages.length > 0 && (
              <div className="mb-6">
                <BarChart
                  data={analytics.parameterAverages}
                  title="Parameter-wise Average Ratings (Out of 5)"
                  valueKey={Array.isArray(analytics.parameterAverages) && typeof analytics.parameterAverages[0] === 'number' ? 'value' : 'average'}
                  maxValue={5}
                />
              </div>
            )}

            {/* Subject Breakdown */}
            {analytics.subjectBreakdown && analytics.subjectBreakdown.length > 0 && (
              <div className="mb-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Subject-wise Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                          <th className="px-6 py-3 text-left text-sm font-semibold">Subject</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Average Rating</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Feedback Count</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {analytics.subjectBreakdown.map((subject, index) => (
                          <tr key={index} className="hover:bg-blue-50 transition-colors duration-200">
                            <td className="px-6 py-4 text-gray-900 font-medium">{subject.subjectName || subject.subjectCode}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                {subject.avgRating?.toFixed(2) || subject.averageRating?.toFixed(2) || 0} / 5
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-700">{subject.feedbackCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Comments Section */}
            {analytics.commentsPreview && analytics.commentsPreview.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Student Comments</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {analytics.commentsPreview.map((comment, index) => (
                    <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                      <p className="text-gray-700 italic">\"{comment}\"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-700 text-lg">No data available for this teacher</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Teacher