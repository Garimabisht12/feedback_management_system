import { useState } from 'react'
import './App.css'
import {BrowserRouter, BrowserRouter as Router} from 'react-router-dom'
import AppRouter from './routes/AppRouter'
function App() {
  
  return (
    <>
    <BrowserRouter >
      <AppRouter />
    </BrowserRouter>
    </>
  )
}

export default App
