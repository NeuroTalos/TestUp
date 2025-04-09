import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationWidget from './components/registration_form/registration.jsx';
import HomeWidget from './components/home_form/home.jsx';

function App() {
  return (
    <Router>
      <div className='flex'>
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={<HomeWidget />} />
          
          {/* Страница регистрации */}
          <Route path="/registration" element={<RegistrationWidget />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
