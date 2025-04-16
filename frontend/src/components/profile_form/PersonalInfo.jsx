import React, { useState } from 'react';
import { Card, Row, Col, Button } from 'antd';
import axios from 'axios';
import LabeledInput from './LabeledInput';

const PersonalInfo = ({ profile }) => {
    const [formData, setFormData] = useState({ ...profile });

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const convertGenderToBackendFormat = (gender) => {
        if (gender === 'Мужской') {
            return 'male';
        } else if (gender === 'Женский') {
            return 'female';
        }
        return gender;
    };

    const handleSave = () => {
        try {
            const updatedData = {
                ...formData,
                gender: convertGenderToBackendFormat(formData.gender),
            };
            console.log(updatedData)
            axios.put(
                'http://127.0.0.1:8000/students/update',
                updatedData,
                { 
                    withCredentials: true,
                }
            )
            window.location.reload();
        } catch (error) {
            console.error(error);
            message.error('Ошибка при обновлении данных');
        }
    };

    return (
        <div className="p-6 w-full">
            <Card
                title="Личные данные"
                styles={{
                    header: {
                        borderBottom: '2px solid #283144',
                        color: 'white',
                        backgroundColor: '#343F4D'
                    },
                    body: {
                        overflowX: 'auto',         
                        paddingBottom: '16px',
                    },
                }}
                style={{
                    backgroundColor: '#343F4D',
                    border: '1px solid #283144',
                    color: 'white',
                }}
            >
                <div style={{ minWidth: '800px' }}> 
                    <Row className="mb-5">
                        <Col span={8}>
                            <LabeledInput
                                label="Имя"
                                value={formData.first_name}
                                onChange={e => handleChange('first_name', e.target.value)}
                            />
                        </Col>
                        <Col span={8}>
                            <LabeledInput
                                label="Фамилия"
                                value={formData.last_name}
                                onChange={e => handleChange('last_name', e.target.value)}
                            />
                        </Col>
                        <Col span={8}>
                            <LabeledInput
                                label="Отчество"
                                value={formData.middle_name}
                                onChange={e => handleChange('middle_name', e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-5">
                        <Col span={8}>
                            <LabeledInput
                                label="Дата рождения"
                                value={formData.date_of_birth}
                                onChange={e => handleChange('date_of_birth', e.target.value)}
                            />
                        </Col>
                        <Col span={8}>
                            <LabeledInput
                                label="Пол"
                                value={formData.gender}
                                onChange={e => handleChange('gender', e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-5">
                        <Col span={8}>
                            <LabeledInput
                                label="Email"
                                value={formData.email}
                                onChange={e => handleChange('email', e.target.value)}
                            />
                        </Col>
                        <Col span={8}>
                            <LabeledInput
                                label="Телефон"
                                value={formData.phone}
                                onChange={e => handleChange('phone', e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-5">
                        <Col span={8}>
                            <LabeledInput
                                label="Курс"
                                value={formData.course}
                                onChange={e => handleChange('course', e.target.value)}
                            />
                        </Col>
                        <Col span={8}>
                            <LabeledInput
                                label="Группа"
                                value={formData.group}
                                onChange={e => handleChange('group', e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-5">
                        <Col span={8}>
                            <LabeledInput
                                label="Факультет"
                                value={formData.faculty_name}
                                onChange={e => handleChange('faculty_name', e.target.value)}
                            />
                        </Col>
                        <Col span={8}>
                            <LabeledInput
                                label="Направление"
                                value={formData.major_name}
                                onChange={e => handleChange('major_name', e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Button type="primary" onClick={handleSave}>
                                Сохранить изменения
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
    );
};

export default PersonalInfo;
