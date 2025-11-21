import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'

const ManageFaculty = () => {
  const [faculties, setFaculties] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    teacherName: '',
    department: '',
    subjectsTaught: []
  })
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [facultyRes, subjectRes] = await Promise.all([
        axios.get('/faculty/all'),
        axios.get('/subjects/all')
      ])
      setFaculties(facultyRes.data || [])
      setSubjects(subjectRes.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubjectToggle = (subjectName) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subjectName)) {
        return prev.filter(s => s !== subjectName)
      } else {
        return [...prev, subjectName]
      }
    })
  }

  const handleAddFaculty = async (e) => {
    e.preventDefault()
    try {
      const facultyData = {
        ...formData,
        subjectsTaught: selectedSubjects
      }

      await axios.post('/faculty/add', facultyData)

      // Reset form
      setFormData({
        teacherName: '',
        department: '',
        subjectsTaught: []
      })
      setSelectedSubjects([])
      setShowAddForm(false)

      // Refresh faculty list
      fetchData()
      alert('Faculty added successfully!')
    } catch (error) {
      console.error('Error adding faculty:', error)
      alert(error.response?.data?.message || 'Failed to add faculty')
    }
  }

  const handleDeleteFaculty = async (facultyId, teacherName) => {
    if (window.confirm(`Are you sure you want to delete ${teacherName}?`)) {
      try {
        await axios.delete(`/faculty/delete/${facultyId}`)
        fetchData()
        alert('Faculty deleted successfully!')
      } catch (error) {
        console.error('Error deleting faculty:', error)
        alert(error.response?.data?.message || 'Failed to delete faculty')
      }
    }
  }

  const handleBack = () => {
    navigate('/adminDashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f0] to-[#e8e4dc] p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(139,123,105,0.15)] p-8 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[#4a4238] tracking-tight">Manage Faculty</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-6 py-2 bg-gradient-to-br from-[#d4c5b9] to-[#b8a99a] text-white rounded-lg font-medium transition-all duration-300 hover:from-[#c4b5a6] hover:to-[#a89989] hover:shadow-lg"
              >
                {showAddForm ? 'Cancel' : 'Add Faculty'}
              </button>
              <button
                onClick={handleBack}
                className="px-6 py-2 border-2 border-[#d4c5b9] text-[#4a4238] rounded-lg font-medium transition-all duration-300 hover:bg-[#fafaf8]"
              >
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Add Faculty Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(139,123,105,0.15)] p-8 mb-6">
            <h2 className="text-2xl font-semibold text-[#4a4238] mb-6">Add New Faculty</h2>
            <form onSubmit={handleAddFaculty}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block mb-2 text-[#5a4f45] text-sm font-medium">
                    Teacher Name *
                  </label>
                  <input
                    type="text"
                    name="teacherName"
                    value={formData.teacherName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter teacher name"
                    className="w-full px-4 py-3 border-2 border-[#e8e4dc] rounded-lg text-[#4a4238] bg-[#fafaf8] transition-all duration-300 focus:outline-none focus:border-[#c4b5a6] focus:bg-white placeholder:text-[#b8a99a]"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-[#5a4f45] text-sm font-medium">
                    Department *
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter department"
                    className="w-full px-4 py-3 border-2 border-[#e8e4dc] rounded-lg text-[#4a4238] bg-[#fafaf8] transition-all duration-300 focus:outline-none focus:border-[#c4b5a6] focus:bg-white placeholder:text-[#b8a99a]"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-3 text-[#5a4f45] text-sm font-medium">
                  Subjects Taught
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-4 bg-[#fafaf8] rounded-lg border-2 border-[#e8e4dc]">
                  {subjects.map((subject, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject.subjectName)}
                        onChange={() => handleSubjectToggle(subject.subjectName)}
                        className="w-4 h-4 text-[#d4c5b9] border-[#c4b5a6] rounded focus:ring-[#d4c5b9]"
                      />
                      <span className="text-sm text-[#4a4238]">{subject.subjectName}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-[#8b7b69] mt-2">
                  Selected: {selectedSubjects.length} subjects
                </p>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-br from-[#d4c5b9] to-[#b8a99a] text-white rounded-lg font-semibold transition-all duration-300 hover:from-[#c4b5a6] hover:to-[#a89989] hover:shadow-lg uppercase tracking-wider"
              >
                Add Faculty
              </button>
            </form>
          </div>
        )}

        {/* Faculty List */}
        <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(139,123,105,0.15)] overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-[#d4c5b9] to-[#b8a99a]">
            <h2 className="text-xl font-semibold text-white">Faculty List</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#d4c5b9] border-t-transparent"></div>
              <p className="mt-4 text-[#8b7b69]">Loading faculties...</p>
            </div>
          ) : faculties.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-[#d4c5b9] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-[#8b7b69] text-lg">No faculty members found</p>
              <p className="text-[#b8a99a] text-sm mt-2">Click "Add Faculty" to add new members</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#fafaf8] border-b-2 border-[#e8e4dc]">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a4238] uppercase tracking-wider">S.No</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a4238] uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a4238] uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a4238] uppercase tracking-wider">Subjects</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#4a4238] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e4dc]">
                  {faculties.map((faculty, index) => (
                    <tr
                      key={faculty._id}
                      className="hover:bg-[#fafaf8] transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-[#4a4238] font-medium">{index + 1}</td>
                      <td className="px-6 py-4 text-[#4a4238] font-medium">{faculty.teacherName}</td>
                      <td className="px-6 py-4 text-[#5a4f45]">{faculty.department}</td>
                      <td className="px-6 py-4 text-[#5a4f45]">
                        <div className="flex flex-wrap gap-1">
                          {faculty.subjectsTaught?.length > 0 ? (
                            faculty.subjectsTaught.map((subject, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-[#f5f5f0] text-[#5a4f45] text-xs rounded-full"
                              >
                                {subject}
                              </span>
                            ))
                          ) : (
                            <span className="text-[#b8a99a] text-sm">No subjects</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteFaculty(faculty._id, faculty.teacherName)}
                          className="px-4 py-2 bg-gradient-to-br from-[#f5d5d5] to-[#f5b5b5] text-[#991b1b] rounded-lg font-medium transition-all duration-300 hover:from-[#f5b5b5] hover:to-[#f59595] hover:shadow-lg"
                        >
                          Delete
                        </button>
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

export default ManageFaculty