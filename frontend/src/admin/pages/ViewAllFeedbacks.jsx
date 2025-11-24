import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'

const ViewAllFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedFeedback, setSelectedFeedback] = useState(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetchAllFeedbacks()
    }, [])

    const fetchAllFeedbacks = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/admin/feedbacks')
            setFeedbacks(response.data.data || [])
            setLoading(false)
        } catch (error) {
            console.error('Error fetching feedbacks:', error)
            setLoading(false)
        }
    }

    const handleDeleteFeedback = async (feedbackId, studentRoll) => {
        if (window.confirm(`Are you sure you want to delete feedback from ${studentRoll}?`)) {
            try {
                await axios.delete(`/admin/feedbacks/${feedbackId}`)
                fetchAllFeedbacks()
                alert('Feedback deleted successfully!')
                setShowDetailModal(false)
            } catch (error) {
                console.error('Error deleting feedback:', error)
                alert(error.response?.data?.message || 'Failed to delete feedback')
            }
        }
    }

    const handleViewDetails = (feedback) => {
        setSelectedFeedback(feedback)
        setShowDetailModal(true)
    }

    const handleBack = () => {
        navigate('/adminDashboard')
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">All Feedbacks</h1>
                            <p className="text-gray-600 mt-1">Manage and view all submitted feedbacks</p>
                        </div>
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Feedbacks List */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
                        <h2 className="text-xl font-semibold text-white">
                            Total Feedbacks: {feedbacks.length}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                            <p className="mt-4 text-gray-700 text-lg">Loading feedbacks...</p>
                        </div>
                    ) : feedbacks.length === 0 ? (
                        <div className="p-12 text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-600 text-lg">No feedbacks found</p>
                            <p className="text-gray-400 text-sm mt-2">Feedbacks will appear here once students submit them</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">S.No</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Roll Number</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Session</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Semester</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Batch</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Submitted At</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {feedbacks.map((feedback, index) => (
                                        <tr
                                            key={feedback._id}
                                            className="hover:bg-blue-50 transition-colors duration-200"
                                        >
                                            <td className="px-6 py-4 text-gray-900 font-medium">{index + 1}</td>
                                            <td className="px-6 py-4 text-gray-900 font-medium">{feedback.studentRoll}</td>
                                            <td className="px-6 py-4 text-gray-700">{feedback.session}</td>
                                            <td className="px-6 py-4 text-gray-700">{feedback.semester}</td>
                                            <td className="px-6 py-4 text-gray-700">{feedback.batch}</td>
                                            <td className="px-6 py-4 text-gray-700">{formatDate(feedback.submittedAt)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(feedback)}
                                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteFeedback(feedback._id, feedback.studentRoll)}
                                                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-lg"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedFeedback && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Feedback Details</h2>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-white hover:text-gray-200 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Student Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Roll Number</p>
                                    <p className="text-lg font-semibold text-gray-900">{selectedFeedback.studentRoll}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Session</p>
                                    <p className="text-lg font-semibold text-gray-900">{selectedFeedback.session}</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Semester</p>
                                    <p className="text-lg font-semibold text-gray-900">{selectedFeedback.semester}</p>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Batch</p>
                                    <p className="text-lg font-semibold text-gray-900">{selectedFeedback.batch}</p>
                                </div>
                            </div>

                            {/* Ratings */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Subject Ratings</h3>
                                <div className="space-y-4">
                                    {selectedFeedback.ratings && Object.entries(selectedFeedback.ratings).map(([subject, ratings], index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-2">{subject}</h4>
                                            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                                {Array.isArray(ratings) && ratings.map((rating, idx) => (
                                                    <div key={idx} className="bg-white p-2 rounded text-center border border-gray-200">
                                                        <p className="text-xs text-gray-600">P{idx + 1}</p>
                                                        <p className="text-lg font-bold text-blue-600">{rating}/5</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Overall Performance */}
                            {selectedFeedback.overallData && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Overall Performance Metrics</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {Object.entries(selectedFeedback.overallData).map(([key, value], index) => (
                                            <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200">
                                                <p className="text-sm text-gray-600 mb-1 capitalize">{key}</p>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {typeof value === 'object' ? JSON.stringify(value) : value}
                                                    {['syllabus', 'voice', 'regularity'].includes(key) ? '/10' : ''}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Best Teachers */}
                            {selectedFeedback.bestTeachers && selectedFeedback.bestTeachers.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Best Teachers Selected</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedFeedback.bestTeachers.map((teacher, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-medium"
                                            >
                                                {teacher}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Comments */}
                            {selectedFeedback.comments && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Additional Comments</h3>
                                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                                        <p className="text-gray-700 italic">"{selectedFeedback.comments}"</p>
                                    </div>
                                </div>
                            )}

                            {/* Submission Time */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Submitted At</p>
                                <p className="text-lg font-semibold text-gray-900">{formatDate(selectedFeedback.submittedAt)}</p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t border-gray-200">
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => handleDeleteFeedback(selectedFeedback._id, selectedFeedback.studentRoll)}
                                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg"
                                >
                                    Delete Feedback
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ViewAllFeedbacks
