import { useState } from 'react'
import './App.css'
import User from './components/User'
import StudentLogin from './components/StudentLogin'
import Form from './components/Form'
import Responded from './components/Responded'
import Submitted from './components/Submitted'

function App() {
  
  return (
    <>
      <h1>Feedback Manangement System</h1>
        <User />
        <StudentLogin />
        <Form />
        <Submitted />
        <Responded />
    </>
  )
}

export default App
