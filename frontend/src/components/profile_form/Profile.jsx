import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Alert } from 'antd';
import Sidebar from './Sidebar';
import ProfileInfo from './ProfileInfo';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState('info');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/students/{studentId}`, {
                    withCredentials: true,
                });
                setProfile(response.data);
            } catch (error) {
                setError('Ошибка при загрузке профиля');
                console.error("Ошибка при загрузке профиля:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-screen h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center w-screen h-screen">
                <Alert message={error} type="error" showIcon />
            </div>
        );
    }

    return (
        <div className="flex w-screen h-screen" style={{ backgroundColor: '#002040' }}>
            <Sidebar
                fullName={`${profile.first_name} ${profile.middle_name ? profile.middle_name + ' ' : ''}${profile.last_name}`}
                selectedKey={selectedTab}
                onSelect={setSelectedTab}
            />
            <div className="flex-1 overflow-auto">
                {selectedTab === 'info' && <ProfileInfo profile={profile} />}
                {selectedTab === 'tasks' && (
                    <div className="p-6 text-gray-600 text-center">Пока нет заданий</div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
