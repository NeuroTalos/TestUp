import React, { useContext, useEffect, useState } from 'react';
import { Card } from 'antd';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthInfo = ({ email }) => {
    const { role, logout } = useContext(AuthContext);
    const [login, setLogin] = useState('Загрузка...');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLogin = async () => {
            try {
                const endpoint =
                    role === 'student'
                        ? 'http://127.0.0.1:8000/students/current_login'
                        : 'http://127.0.0.1:8000/employers/current_login';

                const response = await axios.get(endpoint, { withCredentials: true });
                setLogin(response.data.login);
            } catch (error) {
                console.error('Ошибка при получении логина:', error);
                setLogin('Ошибка загрузки');
            }
        };

        fetchLogin();
    }, [role]);

    const handlePasswordChange = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/email/send_email', { email });
            logout();
            navigate('/');
        } catch (error) {
            console.error('Ошибка при отправке письма для сброса пароля:', error);
        }
    };

    return (
        <div className="p-6 w-full">
            <Card
                title="Учётные данные"
                styles={{
                    header: {
                        borderBottom: '2px solid #283144',
                        color: 'white',
                        backgroundColor: '#343F4D'
                    }
                }}
                style={{
                    backgroundColor: '#343F4D',
                    border: '1px solid #283144',
                    color: 'white'
                }}
            >
                <div className="text-white mb-4 ml-1">
                    <strong>Логин:</strong> {login}
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="
                        px-4 py-2 
                        rounded 
                        text-white 
                        bg-[#1565c0] 
                        hover:bg-[#1476cc] 
                        transition 
                        duration-200
                        cursor-pointer
                    "
                >
                    Сменить пароль
                </button>
            </Card>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>
                    <div className="bg-gray-800 text-white rounded-md p-6 w-96 text-center shadow-2xl z-10">
                        <h2 className="text-lg font-semibold mb-4">
                            Сброс пароля приведёт к выходу из аккаунта.
                        </h2>
                        <p className="text-sm text-gray-300 mb-6">
                            Продолжить и отправить письмо с инструкциями?
                        </p>
                        <div className="flex justify-between space-x-4">
                            <button
                                onClick={handlePasswordChange}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
                            >
                                Отправить
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthInfo;
