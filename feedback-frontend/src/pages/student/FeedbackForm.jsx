import axios from '../../api/axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import {feedbackParameters as feedbackParams} from '../../utilities/feedback-parameters' 

export function FeedbackForm () {
  const [session, setSession] = useState('')
  const [semester, setSemester] = useState('')
  const [batch, setBatch] = useState('')
  const location = useLocation()
  const studentInfo = location.state || {}
  const [studentData, setStudentData] = useState(studentInfo)
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const rollNo = studentInfo.rollNo || ''
  const navigate = useNavigate()
  const [ratings, setRatings] = useState({})
  const [overallData, setOverallData] = useState({})
  const [comments, setComments] = useState('')
  const [bestTeachers, setBestTeachers] = useState(['', '', ''])
  const [suggestions, setSuggestions] = useState('')
  const [disableSubmit, setDisableSubmit] = useState(false)
  const handleBack = () => {
    navigate('/')
  }

  const loadSubjects = async e => {
    e.preventDefault()
    try {
      setLoadingSubjects(true)
      const response = await axios.get('/student/subjects')
      if (response.data.data.length === 0) {
        alert('No subjects found for the selected session, semester, and batch.')
        return
      }
      setSubjects(response.data.data)
      const initRatings = {}
      const initOverallData = {}
      response.data.data.forEach(subject => {
        initRatings[subject.subjectCode] = Array(9).fill('')
        initOverallData[subject.subjectCode] = { syllabus: '', voice: '', regularity: '' }
      })
      setRatings(initRatings)
      setOverallData(initOverallData)
    } catch (error) {
      alert('Error loading subjects: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoadingSubjects(false)
      setDisableSubmit(true)
    }
  }

  const courseSems = {
    "B.Tech": 8,
    BCA: 6,
    MCA: 4
  }

  const calculateAverageRating = (subjectId) => {
  const subjectRatings = ratings[subjectId] || []

  const validRatings = subjectRatings
    .slice(0, 9)
    .filter(r => r !== '' && r != null)
    .map(Number)

  if (validRatings.length === 0) return 0

  const sum = validRatings.reduce((a, b) => a + b, 0)

  return (sum / validRatings.length).toFixed(2)
}
  const getAvgColor = (avg) => {
    const val = parseFloat(avg)
    if (val >= 4) return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    if (val >= 3) return 'text-amber-600 bg-amber-50 border-amber-200'
    return 'text-red-500 bg-red-50 border-red-200'
  }

  const renderRatingsTable = () => (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="border-collapse w-full">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="p-3 border-r border-slate-600 text-center text-xs font-semibold uppercase tracking-wider w-12 sticky left-0 bg-slate-800 z-20">#</th>
            <th className="p-3 border-r border-slate-600 text-left text-xs font-semibold uppercase tracking-wider min-w-[220px] sticky left-12 bg-slate-800 z-20">Parameter</th>
            {subjects.map((subject) => (
              <th key={subject._id} className="p-3 border-r border-slate-600 text-center min-w-[140px] bg-slate-700">
                <div className="text-xs font-bold text-blue-300 tracking-wide">{subject.subjectCode}</div>
                <div className="text-xs text-slate-200 mt-0.5 leading-tight">{subject.subjectName}</div>
                <div className="text-xs text-slate-400 italic mt-0.5">{subject.teacherName}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {feedbackParams.slice(0, 9).map((param, i) => (
            <tr key={param.sNo} className={`transition-colors ${i % 2 === 0 ? 'bg-white hover:bg-blue-50/40' : 'bg-slate-50/60 hover:bg-blue-50/40'}`}>
              <td className="p-3 border-r border-b border-slate-200 text-center font-bold text-slate-400 text-sm sticky left-0 bg-inherit z-10">
                {param.sNo}
              </td>
              <td className="p-3 border-r border-b border-slate-200 text-sm text-slate-700 min-w-[220px] sticky left-12 bg-inherit z-10 leading-snug">
                {param.parameter}
              </td>
              {subjects.map((subject) => (
                <td key={subject._id} className="p-2 border-r border-b border-slate-200 text-center">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={ratings[subject.subjectCode]?.[i] || ""}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 5)) {
                        setRatings(prev => ({
                          ...prev,
                          [subject.subjectCode]: prev[subject.subjectCode].map((r, idx) => (idx === i ? value : r)),
                        }))
                      }
                    }}
                    className="w-16 mx-auto block text-center py-1.5 px-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="1-5"
                  />
                </td>
              ))}
            </tr>
          ))}
          <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <td className="p-3 border-r border-blue-500 text-center text-xs font-bold uppercase tracking-wider sticky left-0 bg-blue-600 z-10">Avg</td>
            <td className="p-3 border-r border-blue-500 text-sm font-bold min-w-[220px] sticky left-12 bg-blue-600 z-10">Overall Average Rating</td>
            {subjects.map((subject) => {
              const avg = calculateAverageRating(subject.subjectCode)
              return (
                <td key={subject._id} className="p-2 border-r border-blue-500 text-center">
                  <div className={`inline-block py-1 px-4 rounded-full font-bold text-sm border ${getAvgColor(avg)}`}>
                    {avg}
                  </div>
                </td>
              )
            })}
          </tr>
        </tbody>
      </table>
    </div>
  )

  const handleSubmit = async() => {
    for (const subject of subjects) {
      const subjectRatings = ratings[subject.subjectCode] || []
      for (let i = 0; i < 9; i++) {
        if (!subjectRatings[i]) {
          alert(`Please fill all ratings for ${subject.subjectName}`)
          return
        }
      }
    }
    for (const subject of subjects) {
      const data = overallData[subject.subjectCode]
      if (!data.syllabus || !data.voice || !data.regularity) {
        alert(`Please fill all overall data for ${subject.subjectName}`)
        return
      }
    }
    if (bestTeachers.some(t => !t)) {
      alert('Please select all three best teachers')
      return
    }
    try {
      setLoading(true)
      const response = await axios.post('/student/feedback/submit', {
        studentRoll: rollNo,
        session,
        semester: Number(semester),
        batch: Number(batch),
        ratings,
        overallData,
        comments,
        bestTeachers,
        suggestions,
        submittedAt: new Date(),
      })
      alert('Feedback submitted successfully!')
      navigate('/submitted')
    } catch(e) {
      alert('Error submitting feedback: ' + (e.response?.data?.message || e.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 p-4 sm:p-6 lg:p-8">

      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-5">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl font-medium text-sm shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:shadow transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>
      </div>

      {/* Main Card */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-blue-900 px-6 sm:px-10 py-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-400/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest">Academic Feedback</p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">Student Feedback Form</h1>
          <p className="text-slate-400 text-sm mt-1">Share your experience to help us improve teaching quality</p>
        </div>

        <div className="p-6 sm:p-10">

          {/* Student Info */}
          {loading ? (
            <div className="flex items-center justify-center py-10 gap-3">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-500 text-sm">Loading student data...</span>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 mb-8">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Student Information</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Name', value: studentData.studentName },
                  { label: 'Roll No', value: studentData.rollNo },
                  { label: 'Course', value: studentData.course },
                  { label: 'Branch', value: studentData.branch },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-slate-800">{value || '—'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Session / Semester / Batch Form */}
          <div className="bg-blue-50/60 rounded-xl border border-blue-100 p-5 mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Select Session Details</h2>
            <form onSubmit={loadSubjects} className="flex flex-wrap gap-4 items-end">
              <div className="flex flex-col gap-1.5 min-w-[140px] flex-1 sm:flex-none">
                <label htmlFor="session" className="text-sm font-medium text-slate-600">Session</label>
                <select
                  id="session"
                  className="py-2.5 px-3 border border-slate-300 rounded-lg bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  name="session"
                  value={session}
                  onChange={e => setSession(e.target.value)}
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="2024-2025">2024-25</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 min-w-[120px] flex-1 sm:flex-none">
                <label htmlFor="semester" className="text-sm font-medium text-slate-600">Semester</label>
                <select
                  id="semester"
                  className="py-2.5 px-3 border border-slate-300 rounded-lg bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  name="semester"
                  value={semester}
                  onChange={e => setSemester(e.target.value)}
                  required
                >
                  <option value="">-- Select --</option>
                  {[...Array(courseSems[studentData.course])].map((_, i) => (
                    <option value={i + 1} key={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5 min-w-[120px] flex-1 sm:flex-none">
                <label htmlFor="batch" className="text-sm font-medium text-slate-600">Batch</label>
                <select
                  id="batch"
                  className="py-2.5 px-3 border border-slate-300 rounded-lg bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  name="batch"
                  value={batch}
                  onChange={e => setBatch(e.target.value)}
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={disableSubmit}
                className="inline-flex items-center gap-2 py-2.5 px-6 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow w-full sm:w-auto justify-center"
              >
                {loadingSubjects ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Load Subjects
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Subjects Loaded */}
          {subjects.length !== 0 && (
            <>
              {/* Section: Detailed Ratings */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  <h3 className="text-lg font-bold text-slate-800">Detailed Ratings</h3>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">(Rate each parameter 1–5)</span>
                </div>
                {renderRatingsTable()}
              </div>

              {/* Section: Overall Subject Data */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                  <h3 className="text-lg font-bold text-slate-800">Overall Subject Data</h3>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">(Rate 1–10)</span>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-800 text-white text-xs uppercase tracking-wider">
                        <th className="p-3 border-r border-slate-600 text-left font-semibold">Subject</th>
                        <th className="p-3 border-r border-slate-600 text-left font-semibold">Teacher</th>
                        <th className="p-3 border-r border-slate-600 text-center font-semibold min-w-[130px]">Syllabus</th>
                        <th className="p-3 border-r border-slate-600 text-center font-semibold min-w-[130px]">Voice Skills</th>
                        <th className="p-3 text-center font-semibold min-w-[130px]">Regularity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject, i) => (
                        <tr key={subject._id} className={`transition-colors ${i % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-100/60'}`}>
                          <td className="p-3 border-r border-b border-slate-200">
                            <div className="text-sm font-semibold text-slate-800">{subject.subjectCode}</div>
                            <div className="text-xs text-slate-500">{subject.subjectName}</div>
                          </td>
                          <td className="p-3 border-r border-b border-slate-200 text-sm text-slate-600">{subject.teacherName}</td>
                          {['syllabus', 'voice', 'regularity'].map((field, fi) => (
                            <td key={field} className={`p-2 border-b border-slate-200 text-center ${fi < 2 ? 'border-r' : ''}`}>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={overallData[subject.subjectCode]?.[field] || ''}
                                onChange={e => setOverallData(prev => ({
                                  ...prev,
                                  [subject.subjectCode]: { ...prev[subject.subjectCode], [field]: e.target.value }
                                }))}
                                className="w-16 mx-auto block text-center py-1.5 px-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                                placeholder="1-10"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section: Additional Feedback */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
                  <h3 className="text-lg font-bold text-slate-800">Additional Feedback</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Comments
                      <span className="text-slate-400 font-normal ml-1 text-xs">(optional)</span>
                    </label>
                    <textarea
                      value={comments}
                      onChange={e => setComments(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none bg-white"
                      rows="4"
                      placeholder="Any additional comments about your experience..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Suggestions
                      <span className="text-slate-400 font-normal ml-1 text-xs">(optional)</span>
                    </label>
                    <textarea
                      value={suggestions}
                      onChange={e => setSuggestions(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none bg-white"
                      rows="4"
                      placeholder="Share your suggestions for improvement..."
                    />
                  </div>
                </div>

                {/* Best Teachers */}
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Best Teachers
                    <span className="text-slate-400 font-normal ml-1 text-xs">— select your top 3</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {bestTeachers.map((teacher, index) => (
                      <div key={index} className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center z-10 pointer-events-none">
                          <span className="text-xs font-bold text-amber-700">{index + 1}</span>
                        </div>
                        <select
                          value={teacher}
                          onChange={e => {
                            const newTeachers = [...bestTeachers]
                            newTeachers[index] = e.target.value
                            setBestTeachers(newTeachers)
                          }}
                          className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                        >
                          <option value="">Select Teacher</option>
                          {subjects.map((subject, i) => (
                            <option key={i} value={subject.teacherName}>{subject.teacherName}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-400 text-center sm:text-left">Please ensure all fields are filled before submitting.</p>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center gap-2 py-3 px-10 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}