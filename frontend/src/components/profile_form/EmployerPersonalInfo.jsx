import React, { useState, useEffect } from 'react';
import { Card, Button, message } from 'antd';
import axios from 'axios';
import isEqual from 'lodash.isequal';
import LabeledInput from './LabeledInput';
import ReadOnlyField from './ReadOnlyField';

const EmployerPersonalInfo = ({ profile }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [formData, setFormData] = useState({ ...profile });
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        setIsChanged(!isEqual(formData, profile));
    }, [formData, profile]);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        try {
            await axios.patch(
                `${API_URL}/employers/update_company_info`,
                formData,
                { withCredentials: true }
            );
            message.success('Данные успешно обновлены');
            window.location.reload();
        } catch (error) {
            console.error(error);
            message.error('Ошибка при обновлении данных');
        }
    };

    return (
        <div className="p-6 w-full">
            <Card
                title="Личные данные компании"
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
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto">
                    <LabeledInput
                        label="Название компании"
                        maxLength={50}
                        value={formData.company_name}
                        onChange={e => handleChange('company_name', e.target.value)}
                    />
                    {/* <LabeledInput
                        label="Email"
                        maxLength={100}
                        value={formData.email}
                        onChange={e => handleChange('email', e.target.value)}
                    /> */}
                    <LabeledInput
                        label="Телефон"
                        maxLength={11}
                        value={formData.phone}
                        onChange={e => handleChange('phone', e.target.value)}
                    />
                    <LabeledInput
                        label="Телеграм"
                        maxLength={40}
                        value={formData.telegram}
                        onChange={e => handleChange('telegram', e.target.value)}
                    />
                    <ReadOnlyField
                        label="Email"
                        value={formData.email}
                    />
                </div>
                <div className="mt-6 text-right">
                    <Button
                        type="primary"
                        onClick={handleSave}
                        disabled={!isChanged}
                    >
                        Сохранить изменения
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default EmployerPersonalInfo;
