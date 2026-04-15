import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Homepage } from './pages/Homepage';
import { AdminLogin } from './pages/admin/Login';
import { StudentLogin } from './pages/student/Login';
import  Responded from './pages/student/Responded';
import { FeedbackForm } from './pages/student/FeedbackForm';
import Dashboard from './pages/admin/Dashboard';
import ViewFeedback from './pages/admin/ViewFeedback';
import UploadSubjects from './pages/admin/UploadSubjects';
import ManageFaculty from './pages/admin/ManageFaculty';
import UploadStudents from './pages/admin/UploadStudents';
import Submitted from './pages/student/Submitted';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/studentLogin' element={<StudentLogin/>} />
        <Route path='/responded'element={<Responded/>} />
        <Route path='/submitted' element={<Submitted />} />
        <Route path='/feedbackForm' element={<FeedbackForm />} />
        <Route path='/adminLogin' element={<AdminLogin/>}/> 
        <Route path='/admin/dashboard' element={<Dashboard />} />
        <Route path='/admin/viewFeedback' element={<ViewFeedback />} />
        <Route path='/admin/manage_faculty' element={<ManageFaculty />} />
        <Route path='/admin/uploadSubjects' element={<UploadSubjects />} />
        <Route path='/admin/uploadStudents' element={<UploadStudents/>} />
      </Routes>
    </>
  )
}

export default App
