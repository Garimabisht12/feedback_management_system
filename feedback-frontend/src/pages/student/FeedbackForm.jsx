// FeedbackForm.jsx

import axios from '../../api/axios'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { feedbackParameters as feedbackParams } from '../../utilities/feedback-parameters'

export function FeedbackForm () {

  const [session, setSession] = useState('')
  const [semester, setSemester] = useState('')
  const [batch, setBatch] = useState('')
  const [checkingStatus, setCheckingStatus] = useState(true)

  const location = useLocation()

  const studentInfo = location.state || {}

  const [studentData] = useState(studentInfo)

  const [subjects, setSubjects] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const checkFeedbackStatus = async () => {
      try {
        const response = await axios.get('/student/feedback/status')

        if (response.data?.submitted) {
          navigate('/submitted')
          return
        }
      } catch (error) {
        console.log(error)
        if (error.response?.status === 401) {
          navigate('/studentLogin')
          return
        }
      } finally {
        setCheckingStatus(false)
      }
    }

    checkFeedbackStatus()
  }, [navigate])

  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-lg font-medium text-slate-700">
          Checking feedback submission status...
        </p>
      </div>
    )
  }

  const [loading, setLoading] = useState(false)

  const [loadingSubjects, setLoadingSubjects] = useState(false)

  const [ratings, setRatings] = useState({})

  const [overallData, setOverallData] = useState({})

  const [comments, setComments] = useState('')

  const [bestTeachers, setBestTeachers] = useState(['', '', ''])

  const [suggestions, setSuggestions] = useState('')

  const rollNo = studentData.rollNo || ''

  const courseSems = {
    "B.Tech": 8,
    BCA: 6,
    MCA: 4
  }

  const handleBack = () => {
    navigate('/')
  }

const loadSubjects = async (e) => {

  e.preventDefault()

  try {

    setLoadingSubjects(true)

    const token = localStorage.getItem('studentToken')

    const response = await axios.get(
      `/student/subjects?semester=${semester}&batch=${batch}&session=${session}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (response.data.data.length === 0) {

      alert('No subjects found')

      return

    }

    setSubjects(response.data.data)

    const initRatings = {}

    const initOverallData = {}

    response.data.data.forEach(subject => {

  const code =
    subject.subjectId?.subjectCode

  initRatings[code] =
    Array(9).fill('')

  initOverallData[code] = {
    syllabus: '',
    voice: '',
    regularity: ''
  }

})

    setRatings(initRatings)

    setOverallData(initOverallData)

  } catch (error) {

    console.log(error)

    alert(
      error.response?.data?.message ||
      'Error loading subjects'
    )

  } finally {

    setLoadingSubjects(false)

  }

}



const calculateAverageRating = (subjectCode) => {

  const subjectRatings =
    ratings[subjectCode] || []

  const validRatings =
    subjectRatings
      .map(Number)
      .filter(
        r =>
          !isNaN(r) &&
          r >= 1 &&
          r <= 5
      )

  if (validRatings.length === 0)
    return 1

  const total =
    validRatings.reduce(
      (sum, curr) => sum + curr,
      0
    )

  return (
    total / validRatings.length
  ).toFixed(1)

}

const handleSubmit = async () => {

  try {

    setLoading(true)

    const token =
      localStorage.getItem('studentToken')

    // VALIDATION


    for (const subject of subjects) {

      const code =
        subject.subjectId?.subjectCode

      const subjectRatings =
        ratings[code] || []

      if (
        subjectRatings.some(
          r =>
            r === '' ||
            Number(r) < 1 ||
            Number(r) > 5
        )
      ) {

        alert(
          `Please fill all ratings for ${code}`
        )

        setLoading(false)

        return

      }

      const overall =
        overallData[code]

      if (
        !overall?.syllabus ||
        !overall?.voice ||
        !overall?.regularity
      ) {

        alert(
          `Please fill overall performance for ${code}`
        )

        setLoading(false)

        return

      }

    }

    // CREATE FEEDBACK ARRAY

    const feedbacks = subjects.map(subject => {

      const code =
        subject.subjectId?.subjectCode

      const avg =
        Number(
          calculateAverageRating(code)
        )

      return {

        subject_code: code,

        subject_name:
          subject.subjectId?.name,

        teacher_name:
          subject.teacherId?.name,

        syllabus_covered:
          Number(
            overallData[code]?.syllabus
          ),

        voice_communication:
          Number(
            overallData[code]?.voice
          ),

        regularity_punctuality:
          Number(
            overallData[code]?.regularity
          ),

        ranking: 5,

        overall_performance: avg,

        parameter_ratings: {

          voice_skill:
            Number(ratings[code][0]),

          systematic_delivery:
            Number(ratings[code][1]),

          behaviour:
            Number(ratings[code][2]),

          interest_in_class:
            Number(ratings[code][3]),

          command_over_subject:
            Number(ratings[code][4]),

          discussion_examples:
            Number(ratings[code][5]),

          punctuality:
            Number(ratings[code][6]),

          class_control:
            Number(ratings[code][7]),

          accessibility:
            Number(ratings[code][8]),

          overall_teacher_rating:
            avg

        },

        comment: comments

      }

    })

console.log(feedbacks)    
    await axios.post(

      '/student/feedback/submit',

      {

        course: studentData.course,

        branch: studentData.branch,

        semester: Number(semester),

        batch: Number(batch),

        feedbacks,

        best_teachers: bestTeachers,

        suggestions,

      },

      {

        headers: {

          Authorization:
            `Bearer ${token}`

        }

      }

    )

    alert(
      'Feedback submitted successfully'
    )

    navigate('/submitted')

  } catch (e) {

    console.log(e)

    alert(

      e.response?.data?.message ||

      e.response?.data?.error ||

      'Error submitting feedback'

    )

  } finally {

    setLoading(false)

  }

}

  return (

    <div className="min-h-screen bg-slate-100 p-6">

      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8">
          Student Feedback Form
        </h1>

        {/* STUDENT INFO */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-semibold">
              {studentData.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Roll No</p>
            <p className="font-semibold">
              {studentData.rollNo}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Course</p>
            <p className="font-semibold">
              {studentData.course}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Branch</p>
            <p className="font-semibold">
              {studentData.branch}
            </p>
          </div>

        </div>

        {/* SESSION DETAILS */}

        <form
          onSubmit={loadSubjects}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >

          <select
            value={session}
            onChange={e => setSession(e.target.value)}
            required
            className="border p-3 rounded-lg"
          >

            <option value="">Select Session</option>

            <option value="2024-2025">
              2024-2025
            </option>

          </select>

          <select
            value={semester}
            onChange={e => setSemester(e.target.value)}
            required
            className="border p-3 rounded-lg"
          >

            <option value="">Semester</option>

            {[...Array(courseSems[studentData.course] || 0)].map((_, i) => (

              <option key={i} value={i + 1}>
                {i + 1}
              </option>

            ))}

          </select>

          <select
            value={batch}
            onChange={e => setBatch(e.target.value)}
            required
            className="border p-3 rounded-lg"
          >

            <option value="">Batch</option>

            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>

          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg px-4 py-3"
          >

            {
              loadingSubjects
                ? 'Loading...'
                : 'Load Subjects'
            }

          </button>

        </form>

        {/* SUBJECT TABLE */}


{
  subjects.length > 0 && (

    <div className="overflow-x-auto">

      {/* RATINGS TABLE */}

      <table className="w-full border">

        <thead>

          <tr className="bg-slate-800 text-white">

            <th className="p-3 border">
              Parameter
            </th>

            {
              subjects.map(subject => (

                <th
                  key={subject._id}
                  className="p-3 border"
                >

                  <div className="font-semibold">
                    {subject.subjectId?.subjectCode}
                  </div>

                  <div className="text-xs">
                    {subject.subjectId?.name}
                  </div>

                  <div className="text-xs text-slate-300 mt-1">
                    {subject.teacherId?.name}
                  </div>

                </th>

              ))
            }

          </tr>

        </thead>

        <tbody>

          {
            feedbackParams.slice(0, 9).map((param, i) => (

              <tr key={i}>

                <td className="border p-3 font-medium">
                  {param.parameter}
                </td>

                {
                  subjects.map(subject => (

                    <td
                      key={subject._id}
                      className="border p-2"
                    >

                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={
                          ratings[
                            subject.subjectId?.subjectCode
                          ]?.[i] || ''
                        }
                        onChange={e => {

                          const value = e.target.value

                          if (
                            value === '' ||
                            (
                              Number(value) >= 1 &&
                              Number(value) <= 5
                            )
                          ) {

                            setRatings(prev => ({

                              ...prev,

                              [subject.subjectId?.subjectCode]:

                                prev[
                                  subject.subjectId?.subjectCode
                                ].map(
                                  (r, idx) =>

                                    idx === i
                                      ? value
                                      : r
                                )

                            }))

                          }

                        }}
                        className="border rounded p-2 w-20"
                      />

                    </td>

                  ))
                }

              </tr>

            ))
          }

        </tbody>

      </table>

      {/* OVERALL PERFORMANCE */}

      <div className="mt-10">

        <h2 className="text-2xl font-bold mb-4">
          Overall Performance
        </h2>

        <table className="w-full border">

          <thead>

            <tr className="bg-slate-800 text-white">

              <th className="p-3 border">
                Subject
              </th>

              <th className="p-3 border">
                Teacher
              </th>

              <th className="p-3 border">
                Syllabus (1-10)
              </th>

              <th className="p-3 border">
                Voice (1-10)
              </th>

              <th className="p-3 border">
                Regularity (1-10)
              </th>

            </tr>

          </thead>

          <tbody>

            {
              subjects.map(subject => (

                <tr key={subject._id}>

                  <td className="border p-3">

                    <div className="font-semibold">
                      {subject.subjectId?.subjectCode}
                    </div>

                    <div className="text-sm text-gray-500">
                      {subject.subjectId?.name}
                    </div>

                  </td>

                  <td className="border p-3">

                    {subject.teacherId?.name}

                  </td>

                  {
                    ['syllabus', 'voice', 'regularity']
                      .map(field => (

                        <td
                          key={field}
                          className="border p-3"
                        >

                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={
                              overallData[
                                subject.subjectId?.subjectCode
                              ]?.[field] || ''
                            }
                            onChange={e => {

                              const value =
                                e.target.value

                              if (
                                value === '' ||
                                (
                                  Number(value) >= 1 &&
                                  Number(value) <= 10
                                )
                              ) {

                                setOverallData(prev => ({

                                  ...prev,

                                  [subject.subjectId?.subjectCode]: {

                                    ...prev[
                                      subject.subjectId?.subjectCode
                                    ],

                                    [field]: value

                                  }

                                }))

                              }

                            }}
                            className="border rounded p-2 w-24"
                          />

                        </td>

                      ))
                  }

                </tr>

              ))
            }

          </tbody>

        </table>

      </div>



{/* BEST TEACHERS */}

<div className="mt-8">

  <h2 className="text-2xl font-bold mb-4">
    Best Teachers
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    {
      bestTeachers.map((teacher, index) => (

        <select
          key={index}
          value={teacher}
          onChange={e => {

            const updated =
              [...bestTeachers]

            updated[index] =
              e.target.value

            setBestTeachers(updated)

          }}
          className="border rounded-lg p-3"
        >

          <option value="">
            Select Teacher
          </option>

          {
            subjects.map(subject => (

              <option
                key={subject._id}
                value={
                  subject.teacherId?.name
                }
              >

                {
                  subject.teacherId?.name
                }

              </option>

            ))
          }

        </select>

      ))
    }

  </div>

</div>


      {/* COMMENTS */}

      <div className="mt-8">

        <textarea
          value={comments}
          onChange={e => setComments(e.target.value)}
          placeholder="Comments"
          className="w-full border rounded-lg p-4 mb-4"
        />

        <textarea
          value={suggestions}
          onChange={e => setSuggestions(e.target.value)}
          placeholder="Suggestions"
          className="w-full border rounded-lg p-4 mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-8 py-3 rounded-lg"
        >

          {
            loading
              ? 'Submitting...'
              : 'Submit Feedback'
          }

        </button>

      </div>

    </div>

  )
}

      </div>

    </div>

  )

}