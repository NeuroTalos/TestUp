import React, { useContext, useEffect, useState } from 'react';
import TaskInfo from './TaskInfo';
import TaskStudentSolutionForm from './TaskStudentSolutionForm';
import StudentSolutionView from '../solutions_form/StudentSolutionView';
import SolutionList from '../solutions_form/SolutionList';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';

const TaskDetails = () => {
  const { state } = useLocation();
  const { task, taskFiles } = state || {};
  const { role } = useContext(AuthContext);
  const [studentSolution, setStudentSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const tabs = {
    info: 'Задание',
    solutions: role === 'student' ? 'Моё решение' : 'Решения',
  };

  const [activeTab, setActiveTab] = useState(tabs.info);

  const isSmallScreen = useMediaQuery({ maxWidth: 750 });

  useEffect(() => {
    const fetchStudentSolution = async () => {
      if (role === 'student') {
        try {
          const res = await axios.get(`http://127.0.0.1:8000/solutions/check_student_solution/${task.id}`, {
            withCredentials: true,
          });
          if (res.data.solution) {
            setStudentSolution(res.data.solution);
          }
        } catch (error) {
          console.warn("Решение не найдено или ошибка:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (task?.id) {
      fetchStudentSolution();
    }
  }, [role, task?.id]);

  const cardContainerStyle = {
    width: isSmallScreen ? '95%' : '70%',
    maxWidth: 900,
    margin: '0 auto',
    padding: 16,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: 8,
    backgroundColor: '#1f2937',
    color: 'white',
    boxSizing: 'border-box',

    display: 'flex',
    flexDirection: 'column',
    maxHeight: '75vh',
    overflow: 'hidden',
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{
        gap: 16,
        paddingTop: 20,
        paddingBottom: 20,
        height: '100vh',
      }}
    >
      {/* Контейнер для кнопки назад и табов */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          borderBottom: '2px solid #4f46e5',
          marginBottom: 16,
          position: 'relative',
        }}
        role="tablist"
      >
        {/* Кнопка назад слева */}
        <button
          onClick={() => navigate(-1)}
          aria-label="Назад"
          style={{
            position: 'absolute',
            left: 0,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            borderRadius: 6,
            transition: 'background-color 0.3s',
            color: '#6366f1',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            style={{ width: 24, height: 24 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Табы по центру */}
        {Object.values(tabs).map(tabName => (
          <button
            key={tabName}
            onClick={() => setActiveTab(tabName)}
            role="tab"
            aria-selected={activeTab === tabName}
            style={{
              padding: '8px 24px',
              cursor: 'pointer',
              borderBottom: activeTab === tabName ? '4px solid #6366f1' : '4px solid transparent',
              background: 'transparent',
              color: activeTab === tabName ? '#6366f1' : '#d1d5db',
              fontWeight: activeTab === tabName ? '700' : '500',
              fontSize: 18,
              borderRadius: 4,
              transition: 'all 0.3s ease',
            }}
          >
            {tabName}
          </button>
        ))}
      </div>

      {/* Карточка с контентом */}
      <div style={cardContainerStyle}>
        <div style={{ flexGrow: 1, overflowY: 'auto' }}>
          {activeTab === tabs.info && (
            <TaskInfo task={task} taskFiles={taskFiles} isEmployer={role === 'employer'} />
          )}

          {activeTab === tabs.solutions && (
            <>
              {role === 'student' && !loading ? (
                task.status === 'active' ? (
                  studentSolution ? (
                    <StudentSolutionView solution={studentSolution} />
                  ) : (
                    <TaskStudentSolutionForm taskId={task.id} />
                  )
                ) : (
                  studentSolution ? (
                    <StudentSolutionView solution={studentSolution} />
                  ) : (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: 20,
                        color: '#9ca3af',
                        fontSize: 20,
                      }}
                    >
                      Это задание уже завершено. Отправка решения невозможна.
                    </div>
                  )
                )
              ) : role === 'employer' ? (
                <SolutionList taskId={task.id} />
              ) : (
                <p style={{ color: '#9ca3af' }}>Пожалуйста, авторизуйтесь, чтобы просмотреть решения.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
