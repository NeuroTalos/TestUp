import React, { useState, useEffect } from 'react';
import { Card, Button, message } from 'antd';
import axios from 'axios';
import { parse, format, isValid } from 'date-fns';
import isEqual from 'lodash.isequal';

import LabeledInput from './LabeledInput';
import DropdownSelect from './DropdownSelect';
import ReadOnlyField from './ReadOnlyField';

const StudentPersonalInfo = ({ profile }) => {
    const formatDateToDisplay = (dateString) => {
        if (!dateString) return '';
        const date = parse(dateString, 'yyyy-MM-dd', new Date());
        if (!isValid(date)) {
            console.error('Неверный формат даты:', dateString);
            return '';
        }
        return format(date, 'dd.MM.yyyy');
    };

    const [formData, setFormData] = useState({
        ...profile,
        date_of_birth: formatDateToDisplay(profile.date_of_birth)
    });

    const [faculties, setFaculties] = useState([]);
    const [majors, setMajors] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(profile.faculty_name || '');
    const [isChanged, setIsChanged] = useState(false);

    const genderOptions = ['Мужской', 'Женский'];
    const courseOptions = ['1', '2', '3', '4', '5'];

    useEffect(() => {
        fetchFacultiesAndMajors();
    }, []);

    useEffect(() => {
        const normalizedFormData = {
            ...formData,
            gender: convertGenderToBackendFormat(formData.gender),
        };

        const normalizedProfile = {
            ...profile,
            date_of_birth: formatDateToDisplay(profile.date_of_birth),
            gender: convertGenderToBackendFormat(profile.gender),
        };

        setIsChanged(!isEqual(normalizedFormData, normalizedProfile));
    }, [formData, profile]);

    useEffect(() => {
        if (selectedFaculty) {
            const selectedFacultyData = faculties.find(faculty => faculty.name === selectedFaculty);
            const filteredMajors = selectedFacultyData ? selectedFacultyData.majors.map(major => major.name) : [];
            setMajors(filteredMajors);

            if (filteredMajors.length > 0 && !filteredMajors.includes(formData.major_name)) {
                setFormData(prev => ({
                    ...prev,
                    major_name: filteredMajors[0],
                }));
            }
        } else {
            setMajors([]);
        }
    }, [selectedFaculty, faculties]);

    const fetchFacultiesAndMajors = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/faculties');
            const data = response.data;

            setFaculties(data);
            if (data.length > 0 && selectedFaculty === '') {
                setSelectedFaculty(data[0].name);
            }
        } catch (err) {
            console.error('Ошибка при загрузке факультетов и направлений', err);
        }
    };

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const convertGenderToBackendFormat = (gender) => {
        if (gender === 'Мужской') return 'male';
        if (gender === 'Женский') return 'female';
        return gender;
    };

    const handleSave = async () => {
        try {
            const updatedData = {
                ...formData,
                gender: convertGenderToBackendFormat(formData.gender),
            };
            await axios.patch(
                'http://127.0.0.1:8000/students/update_personal_info',
                updatedData,
                { withCredentials: true }
            );
            window.location.reload();
        } catch (error) {
            console.error(error);
            message.error('Ошибка при обновлении данных');
        }
    };

    const handleFacultyChange = (value) => {
        setSelectedFaculty(value);
        setFormData(prev => ({ ...prev, faculty_name: value }));
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
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto">
                    <LabeledInput
                        label="Имя"
                        maxLength={100}
                        value={formData.first_name}
                        onChange={e => handleChange('first_name', e.target.value)}
                    />
                    <LabeledInput
                        label="Фамилия"
                        maxLength={100}
                        value={formData.last_name}
                        onChange={e => handleChange('last_name', e.target.value)}
                    />
                    <LabeledInput
                        label="Отчество"
                        maxLength={100}
                        value={formData.middle_name}
                        onChange={e => handleChange('middle_name', e.target.value)}
                    />
                    <LabeledInput
                        label="Email"
                        maxLength={100}
                        value={formData.email}
                        onChange={e => handleChange('email', e.target.value)}
                    />
                    <LabeledInput
                        label="Телефон"
                        maxLength={11}
                        value={formData.phone}
                        onChange={e => handleChange('phone', e.target.value)}
                    />
                    <ReadOnlyField
                        label="Дата рождения"
                        value={formData.date_of_birth}
                    />
                    <ReadOnlyField
                        label="Пол"
                        value={formData.gender}
                    />
                    <ReadOnlyField
                        label="Курс"
                        value={formData.course}
                    />
                    <ReadOnlyField
                        label="Группа"
                        value={formData.group}
                    />
                    <ReadOnlyField
                        label="Факультет"
                        value={formData.faculty_name}
                    />
                    <ReadOnlyField
                        label="Направление"
                        value={formData.major_name}
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

export default StudentPersonalInfo;
