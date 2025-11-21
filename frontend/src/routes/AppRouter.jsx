import React from 'react'
import { Routes, Route } from "react-router-dom";
import User from '../pages/User';
import StudentLogin from '../pages/StudentLogin';
import FeedbackForm from '../components/FeedbackForm';
import Responded from '../components/Responded';
import AdminLogin from '../pages/AdminLogin'
import Dashboard from '../admin/pages/Dashboard';
import ViewFeedback from '../admin/pages/ViewFeedback';
import ManageFaculty from '../admin/pages/ManageFaculty';

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<User />} />
      <Route path='/studentLogin' element={<StudentLogin />} />
      <Route path='/adminLogin' element={<AdminLogin />} />
      <Route path='/FeedbackForm' element={<FeedbackForm />} />
      <Route path='/responded' element={<Responded />} />
      <Route path='/adminDashboard' element={<Dashboard />} />
      <Route path='/viewFeedback' element={<ViewFeedback />} />
      <Route path='/manageFaculty' element={<ManageFaculty />} />
    </Routes>
  )
}

export default AppRouter;