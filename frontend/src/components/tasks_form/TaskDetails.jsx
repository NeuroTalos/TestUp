import React, { useContext, useEffect, useState } from 'react';
import TaskInfo from './TaskInfo';
import TaskStudentSolutionForm from './TaskStudentSolutionForm';
import StudentSolutionView from '../solutions_form/StudentSolutionView';
import SolutionList from '../solutions_form/SolutionList';
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

        fetchStudentSolution();
    }, [role, task.id]);

    return (
        <div
            className="flex h-full"
            style={{
                flexDirection: isSmallScreen ? 'column' : 'row',
                gap: isSmallScreen ? 16 : 0,
            }}
        >
            <TaskInfo task={task} taskFiles={taskFiles} isEmployer={role === 'employer'} />

            <div
                style={{
                    width: isSmallScreen ? '100%' : 2,
                    height: isSmallScreen ? 2 : 'auto',
                    backgroundColor: '#4f46e5',
                    margin: isSmallScreen ? '16px 0' : '0 16px',
                    alignSelf: isSmallScreen ? 'stretch' : 'auto',
                }}
            />

            {role === 'student' && !loading ? (
                studentSolution ? (
                    <StudentSolutionView solution={studentSolution} />
                ) : (
                    <TaskStudentSolutionForm taskId={task.id} />
                )
            ) : role === 'employer' ? (
                <SolutionList taskId={task.id} />
            ) : null}
        </div>
    );
};

export default TaskDetails;
