import React from 'react';
import { Card } from 'antd';

const ProfileInfo = ({ profile }) => {
    return (
        <div className="p-6 w-full">
            <Card
                title={`${profile.first_name} ${profile.middle_name ? profile.middle_name + ' ' : ''}${profile.last_name}`}
                className="shadow-lg"
            >
                <div className="mb-4"><strong>Email:</strong> {profile.email}</div>
                <div className="mb-4"><strong>Телефон:</strong> {profile.phone}</div>
                <div className="mb-4"><strong>Пол:</strong> {profile.gender}</div>
                <div className="mb-4"><strong>Факультет:</strong> {profile.faculty_name}</div>
                <div className="mb-4"><strong>Направление:</strong> {profile.major_name}</div>
                <div className="mb-4"><strong>Курс:</strong> {profile.course}</div>
                <div className="mb-4"><strong>Группа:</strong> {profile.group}</div>
            </Card>
        </div>
    );
};

export default ProfileInfo;
