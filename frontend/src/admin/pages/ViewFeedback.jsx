import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'

const ViewFeedback = () => {
  const [faculties, setFaculties] = useState([])
  const [subjects, setSubjects] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([])
  const [selectedFaculty, setSelectedFaculty] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterFeedbacks()
  }, [selectedFaculty, selectedSubject, feedbacks])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [facultyRes, subjectRes, feedbackRes] = await Promise.all([
        axios.get('/faculty/all'),
        axios.get('/subjects/all'),
        axios.get('/feedback/all')
      ])

      setFaculties(facultyRes.data || [])
      setSubjects(subjectRes.data || [])
      setFeedbacks(feedbackRes.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const filterFeedbacks = () => {
    let filtered = feedbacks

    if (selectedFaculty) {
      filtered = filtered.filter(feedback => {
        // Check if faculty is in the feedback ratings or overallData
        const ratings = feedback.ratings || {}
        const overallData = feedback.overallData || {}
        return Object.keys(ratings).some(key => key.includes(selectedFaculty)) ||
          Object.keys(overallData).some(key => key.includes(selectedFaculty))
      })
    }

    if (selectedSubject) {
      filtered = filtered.filter(feedback => {
        const ratings = feedback.ratings || {}
        return Object.keys(ratings).some(key => key.includes(selectedSubject))
      })
    }

    setFilteredFeedbacks(filtered)
  }

  const handleBack = () => {
    navigate('/adminDashboard')
  }

  const getAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 'N/A'
    const sum = ratings.reduce((acc, val) => acc + val, 0)
    return (sum / ratings.length).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f0] to-[#e8e4dc] p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(139,123,105,0.15)] p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#4a4238] tracking-tight">View Feedbacks</h1>
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gradient-to-br from-[#d4c5b9] to-[#b8a99a] text-white rounded-lg font-medium transition-all duration-300 hover:from-[#c4b5a6] hover:to-[#a89989] hover:shadow-lg"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-[#5a4f45] text-sm font-medium">
                Filter by Faculty
              </label>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e8e4dc] rounded-lg text-[#4a4238] bg-[#fafaf8] transition-all duration-300 focus:outline-none focus:border-[#c4b5a6] focus:bg-white cursor-pointer"
              >
                <option value="">All Faculties</option>
                {faculties.map((faculty, index) => (
                  <option key={index} value={faculty.teacherName}>
                    {faculty.teacherName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-[#5a4f45] text-sm font-medium">
                Filter by Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e8e4dc] rounded-lg text-[#4a4238] bg-[#fafaf8] transition-all duration-300 focus:outline-none focus:border-[#c4b5a6] focus:bg-white cursor-pointer"
              >
                <option value="">All Subjects</option>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject.subjectName}>
                    {subject.subjectName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {(selectedFaculty || selectedSubject) && (
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(139,123,105,0.1)] p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#4a4238] mb-2">
              {selectedFaculty && `Faculty: ${selectedFaculty}`}
            </h2>
            {selectedSubject && (
              <h3 className="text-lg text-[#5a4f45]">Subject: {selectedSubject}</h3>
            )}
            <p className="text-[#8b7b69] mt-2">
              Total Feedbacks: {filteredFeedbacks.length}
            </p>
          </div>
        )}

        {/* Feedback Table */}
        <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(139,123,105,0.15)] overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#d4c5b9] border-t-transparent"></div>
              <p className="mt-4 text-[#8b7b69]">Loading feedbacks...</p>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-[#d4c5b9] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-[#8b7b69] text-lg">No feedbacks found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#d4c5b9] to-[#b8a99a] text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">S.No</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Student Roll</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Session</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Semester</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Batch</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Best Teachers</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Comments</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e4dc]">
                  {filteredFeedbacks.map((feedback, index) => (
                    <tr
                      key={feedback._id}
                      className="hover:bg-[#fafaf8] transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-[#4a4238] font-medium">{index + 1}</td>
                      <td className="px-6 py-4 text-[#4a4238]">{feedback.studentRoll}</td>
                      <td className="px-6 py-4 text-[#5a4f45]">{feedback.session}</td>
                      <td className="px-6 py-4 text-[#5a4f45]">{feedback.semester}</td>
                      <td className="px-6 py-4 text-[#5a4f45]">{feedback.batch}</td>
                      <td className="px-6 py-4 text-[#5a4f45]">
                        {feedback.bestTeachers?.join(', ') || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-[#5a4f45] max-w-xs truncate">
                        {feedback.comments || 'No comments'}
                      </td>
                      <td className="px-6 py-4 text-[#5a4f45]">
                        {new Date(feedback.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewFeedback