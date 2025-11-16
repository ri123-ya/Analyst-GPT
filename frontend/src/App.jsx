import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from "./pages/Register";
import ChatUI from './pages/chatUI';

function App() {

  return (
    
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/' element={<ChatUI/>}/>
    </Routes>
    
  )
}

export default App
