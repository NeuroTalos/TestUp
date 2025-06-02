import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import HomeGuest from './HomeGuest';
import HomeStudent from './HomeStudent';
import HomeEmployer from './HomeEmployer';

const HomeWidget = () => {
  const { isAuthenticated, role } = useContext(AuthContext);

  let content;

  if (isAuthenticated === null) {
    content = <h1>Загрузка...</h1>;
  } else if (!isAuthenticated) {
    content = <HomeGuest />;
  } else if (role === 'student') {
    content = <HomeStudent />;
  } else if (role === 'employer') {
    content = <HomeEmployer />;
  } else {
    content = <h1>Неизвестная роль</h1>;
  }

  return (
    <div className="w-screen grid place-content-center" 
    style={{ 
        backgroundColor: '#002040',
        paddingTop: 80,
        paddingBottom: 40,
        minHeight: 'calc(100vh - 130px)'
    }}
    >
      {content}
    </div>
  );
};

export default HomeWidget;
