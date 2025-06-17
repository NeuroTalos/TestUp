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
import TaskCreate from './components/tasks_form/TaskCreate.jsx';
import EmployerTasksPage from './components/tasks_form/EmployerTasksList.jsx';
import PasswortReset from './components/password_reset/PasswordReset';
import TermsOfUse from './components/info_components/TermsOfUse.jsx';
import PrivacyPolicyPage from './components/info_components/PrivacyPolicy.jsx';
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

              {/* Страница со списком задач для студентов */}
              <Route path="/tasks" element={<TasksListWidget />} />

              {/* Страница со списком размещённых задач для работодателей */}
              <Route path="/employer/tasks" element={<EmployerTasksPage />} />

              {/* Страница с конкретной задачей */}
              <Route path="/tasks/:id" element={<TaskPage />} />

              {/* Страница для создания задачи */}
              <Route path="/tasks/add" element={<TaskCreate />} />

              {/* Страница для сброса пароля */}
              <Route path="/reset-password" element={<PasswortReset />} />

              {/* Страница с правилами пользования */}
              <Route path="/terms" element={<TermsOfUse />} />

              {/* Страница с политикой конфиденциальности */}
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              
            </Route>
          </Routes>
          <ToastContainer position="top-center" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
