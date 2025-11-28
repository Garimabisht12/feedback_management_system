import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  { sNo: 10, parameter: "Overall rating of the teacher (Excellent, Very Good, Good)" },
];


const ViewFeedback = () => {
  const [teachersAnalytics, setTeachersAnalytics] = useState([])
  const [globalAnalytics, setGlobalAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('rating')
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const navigate = useNavigate()


  useEffect(() => {
    fetchAllAnalytics()
  }, [])

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true)
      // Fetch global analytics
      const globalRes = await axios.get('/feedback/analytics')
      setGlobalAnalytics(globalRes.data)

      // Fetch teachers analytics
      const teachersRes = await axios.get('/admin/teachers/analytics')
      setTeachersAnalytics(teachersRes.data.data || [])
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/adminDashboard')
  }

  const handleSelectTeacher = (teacher) => {
    setSelectedTeacher(teacher)
  }

  const handleCloseDetail = () => {
    setSelectedTeacher(null)
  }

  const handleViewDetails = (teacher) => {
    navigate('/teacher', { state: { teacher: teacher } })
  }

  const getSortedTeachers = () => {
    let sorted = [...teachersAnalytics]
    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => b.averageRating - a.averageRating)
      case 'name':
        return sorted.sort((a, b) => a.teacherName.localeCompare(b.teacherName))
      case 'feedbacks':
        return sorted.sort((a, b) => b.totalFeedbacks - a.totalFeedbacks)
      case 'votes':
        return sorted.sort((a, b) => b.bestTeacherVotes - a.bestTeacherVotes)
      case 'syllabus':
        return sorted.sort((a, b) => b.avgSyllabus - a.avgSyllabus)
      default:
        return sorted
    }
  }

  const formatCommentPreview = (comments) => {
    if (!comments || comments.length === 0) return 'No comments'
    return comments[0].substring(0, 60) + (comments[0].length > 60 ? '...' : '')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Faculty Analytics</h1>
              <p className="text-gray-600 mt-1">Click on a faculty to view detailed analytics</p>
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
            <p className="mt-4 text-gray-700 text-lg">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Global Stats Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 opacity-90">Total Feedbacks</h3>
                  <p className="text-5xl font-bold">{globalAnalytics?.totalFeedbacks || 0}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 opacity-90">Faculty Members</h3>
                  <p className="text-5xl font-bold">{teachersAnalytics.length}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 opacity-90">Avg Overall Rating</h3>
                  <p className="text-5xl font-bold">
                    {teachersAnalytics.length > 0
                      ? ((teachersAnalytics.reduce((sum, t) => sum + t.averageRating, 0) / teachersAnalytics.length).toFixed(2))
                      : 0}
                    <span className="text-2xl">/5</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Sort Controls */}
            <div className="mb-6 flex gap-2 flex-wrap">
              <button
                onClick={() => setSortBy('rating')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === 'rating'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-blue-200 hover:border-blue-400'
                }`}
              >
                By Rating
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === 'name'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-blue-200 hover:border-blue-400'
                }`}
              >
                By Name
              </button>
              <button
                onClick={() => setSortBy('feedbacks')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === 'feedbacks'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-blue-200 hover:border-blue-400'
                }`}
              >
                By Feedbacks
              </button>
              <button
                onClick={() => setSortBy('votes')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === 'votes'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-blue-200 hover:border-blue-400'
                }`}
              >
                By Best Teacher Votes
              </button>
            </div>

            {/* Faculty List */}
            {teachersAnalytics.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="divide-y">
                  {getSortedTeachers().map((teacher, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectTeacher(teacher)}
                      className="p-4 hover:bg-blue-50 cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-blue-500"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                              {teacher.averageRating.toFixed(1)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 truncate">{teacher.teacherName}</h3>
                              <p className="text-sm text-gray-600">{teacher.department}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          {teacher.subjectBreakdown && teacher.subjectBreakdown.length > 0 && (
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">{teacher.subjectBreakdown[0].subjectName || teacher.subjectBreakdown[0].subjectCode}</p>
                              <p className="text-xs text-gray-600">{teacher.totalFeedbacks} feedbacks</p>
                            </div>
                          )}
                        </div>
                        <svg className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <p className="text-gray-600 text-lg font-medium">No faculty data available</p>
              </div>
            )}
          </>
        )}

        {/* Detail Modal */}
        {selectedTeacher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedTeacher.teacherName}</h2>
                  <p className="text-blue-100 text-sm mt-1">{selectedTeacher.department}</p>
                </div>
                <button
                  onClick={handleCloseDetail}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Key Metrics Row 1 */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">Total Feedbacks</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedTeacher.totalFeedbacks}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">Best Teacher Votes</p>
                    <p className="text-2xl font-bold text-green-600">{selectedTeacher.bestTeacherVotes}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">Avg Rating</p>
                    <p className="text-2xl font-bold text-purple-600">{selectedTeacher.averageRating}/5</p>
                  </div>
                </div>

                {/* Key Metrics Row 2 - Overall Data (Syllabus, Voice, Regularity) */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">Syllabus</p>
                    <p className="text-2xl font-bold text-orange-600">{selectedTeacher.avgSyllabus}/10</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">Voice</p>
                    <p className="text-2xl font-bold text-red-600">{selectedTeacher.avgVoice}/10</p>
                  </div>
                  <div className="bg-cyan-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">Regularity</p>
                    <p className="text-2xl font-bold text-cyan-600">{selectedTeacher.avgRegularity}/10</p>
                  </div>
                </div>

                {/* Parameter-wise Averages (9 parameters) */}
                {selectedTeacher.parameterAverages && selectedTeacher.parameterAverages.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs font-bold text-gray-700 uppercase mb-3">Parameter-Wise Averages</p>
                    <div className="space-y-2">
                      {selectedTeacher.parameterAverages.map((avg, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{feedbackParams[idx]?.parameter || `Parameter ${idx + 1}`}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(avg / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-bold text-gray-900 w-10 text-right">{avg}/5</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subject Breakdown */}
                {selectedTeacher.subjectBreakdown && selectedTeacher.subjectBreakdown.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs font-bold text-gray-700 uppercase mb-3">Subject Performance</p>
                    <div className="space-y-2">
                      {selectedTeacher.subjectBreakdown.map((subject, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{subject.subjectName || subject.subjectCode}</p>
                            <p className="text-xs text-gray-500">{subject.subjectCode}</p>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {subject.avgRating}/5
                            </span>
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                              {subject.feedbackCount} fb
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments Preview */}
                {selectedTeacher.commentsPreview && selectedTeacher.commentsPreview.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs font-bold text-gray-700 uppercase mb-3">Recent Comments</p>
                    <div className="space-y-2">
                      {selectedTeacher.commentsPreview.map((comment, idx) => (
                        <div key={idx} className="bg-yellow-50 border-l-2 border-yellow-400 p-3 rounded text-sm text-gray-700 italic">
                          "{comment}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={handleCloseDetail}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleCloseDetail()
                    handleViewDetails(selectedTeacher)
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md"
                >
                  View Full Details →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewFeedback