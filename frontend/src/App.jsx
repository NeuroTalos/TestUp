import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/contexts/AuthContext.jsx';

import Layout from './components/Layout';
import RegistrationWidget from './components/registration_form/Registration.jsx';
import HomeWidget from './components/home_form/Home.jsx';
import AuthWidget from './components/auth_form/Auth.jsx';
import ProfileWidget from './components/profile_form/Profile.jsx';
import TasksListWidget from './components/tasks_form/Tasks_list.jsx';
import TaskPage from './components/tasks_form/TaskPage.jsx'
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
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

              {/* Страница личного профиля */}
              <Route path="/profile" element={<ProfileWidget />} />

              {/* Страница со списком задач */}
              <Route path="/tasks" element={<TasksListWidget />} />

              {/* Страница с конкретной задачей */}
              <Route path="/tasks/:id" element={<TaskPage />} />
            </Route>
          </Routes>
          <ToastContainer position="top-center" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
