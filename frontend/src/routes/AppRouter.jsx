import React from 'react'
import {  Routes, Route } from "react-router-dom";
import User from '../components/User';
import StudentLogin from '../components/StudentLogin';
import FeedbackForm from '../components/FeedbackForm';
import Responded from '../components/Responded';
const AppRouter = () => {
  return (
    <Routes>
        <Route path='/' element={<User />} />
        <Route path='/studentLogin' element={<StudentLogin />} />
        <Route path='/FeedbackForm' element={<FeedbackForm />} />
        <Route path='/responded' element={<Responded />} />
    </Routes>
  )
}

export default AppRouter;