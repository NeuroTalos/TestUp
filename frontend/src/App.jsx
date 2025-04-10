import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import RegistrationWidget from './components/registration_form/registration.jsx';
import HomeWidget from './components/home_form/home.jsx';
import AuthWidget from './components/auth_form/auth.jsx';

function App() {
  return (
    <Router>
      <div className='flex'>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Главная страница */}
            <Route path="/" element={<HomeWidget />} />
            
            {/* Страница регистрации */}
            <Route path="/registration" element={<RegistrationWidget />} />

            {/* Страница авторизации */}
            <Route path="/auth" element={<AuthWidget />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
