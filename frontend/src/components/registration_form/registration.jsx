import React, { useState, useRef, useEffect } from 'react';
import { Card, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import LabeledInput from '../profile_form/LabeledInput';
import PasswordInput from './Password_input';
import RegistrationButton from './Registration_button';
import DropdownSelect from '../profile_form/DropdownSelect';

const RegistrationWidget = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState(null);
  const [course, setCourse] = useState(null);
  const [group, setGroup] = useState('');
  const [faculty, setFaculty] = useState(null);
  const [major, setMajor] = useState(null);
  const [registrationError, setRegistrationError] = useState(false);

  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);

  const cardRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (setter) => (e) => setter(e.target.value);
  const handleCourseChange = (value) => setCourse(value);
  const handleFacultyChange = (value) => {
    setFaculty(value);
  
    const selectedFacultyData = faculties.find(fac => fac.name === value);
    const majorsList = selectedFacultyData ? selectedFacultyData.majors.map(m => m.name) : [];
  
    setMajors(majorsList);
    setMajor(majorsList[0] || null);
  };
  const handleMajorChange = (value) => setMajor(value);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/faculties');
        setFaculties(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке факультетов:', error);
      }
    };
    fetchFaculties();
  }, []);

  useEffect(() => {
    const selectedFacultyData = faculties.find(fac => fac.name === faculty);
    setMajors(selectedFacultyData ? selectedFacultyData.majors.map(m => m.name) : []);
  }, [faculty, faculties]);

  const handleSubmit = () => {
    const formData = {
      "login": login,
      "password" : password,
      "first_name" : firstName,
      "last_name" : lastName,
      "middle_name" : middleName,
      "date_of_birth" : dob,
      "email" : email,
      "phone" : phone,
      "gender" : gender,
      "course" : course,
      "group" : group,
      "faculty_name"  : faculty,
      "major_name" : major,
    };

    const convertGenderToBackendFormat = (gender) => {
      if (gender === 'Мужской') return 'male';
      if (gender === 'Женский') return 'female';
      return gender;
    };

    const updatedData = {
      ...formData,
      gender: convertGenderToBackendFormat(formData.gender),
    };

    axios.post('http://127.0.0.1:8000/students/add', updatedData)
      .then(response => {
        setRegistrationError(false);
        navigate('/auth');
      })
      .catch(error => {
        setRegistrationError(true);
        if (cardRef.current) cardRef.current.scrollTop = 0;
      });
  };

  return (
    <div className="w-screen h-screen grid place-content-center px-4" style={{ backgroundColor: '#002040' }}>
      <Space direction="vertical" size={16}>
        <Card
          ref={cardRef}
          title="Регистрация"
          styles={{
            header: {
              borderBottom: '2px solid #283144',
              color: 'white',
              backgroundColor: '#343F4D',
              fontWeight: 'bold',
              fontSize: 24,
              textAlign: 'center',
            },
            body: {
              overflowX: 'auto',
              paddingBottom: '16px',
            },
          }}
          className="w-[90vw] sm:w-[500px] md:w-[570px] lg:w-[700px] xl:w-[750px] rounded-lg overflow-y-auto card-scroll"
          style={{
            maxHeight: '80vh',
            backgroundColor: '#343F4D',
            border: '1px solid #283144',
            color: 'white',
          }}
        >
          {registrationError && (
            <div className="mb-4 ml-42">
              <Typography.Text type="danger">
                Введены некорректные данные
              </Typography.Text>
            </div>
          )}

          <LabeledInput
            label="Логин"
            maxLength={40}
            value={login}
            onChange={handleInputChange(setLogin)}
          />

          <PasswordInput onChange={handleInputChange(setPassword)} />

          <LabeledInput
            label="Имя"
            maxLength={100}
            value={firstName}
            onChange={handleInputChange(setFirstName)}
          />

          <LabeledInput
            label="Фамилия"
            maxLength={100}
            value={lastName}
            onChange={handleInputChange(setLastName)}
          />

          <LabeledInput
            label="Отчество (опционально)"
            maxLength={100}
            value={middleName}
            onChange={handleInputChange(setMiddleName)}
          />

          <LabeledInput
            label="Дата рождения (ДД.ММ.ГГГГ)"
            maxLength={10}
            value={dob}
            onChange={handleInputChange(setDob)}
            mask="00.00.0000"
          />

          <LabeledInput
            label="Электронная почта"
            maxLength={100}
            value={email}
            onChange={handleInputChange(setEmail)}
          />

          <LabeledInput
            label="Телефон"
            maxLength={11}
            value={phone}
            onChange={handleInputChange(setPhone)}
          />

          <DropdownSelect
            label="Пол"
            options={['Мужской', 'Женский']}
            value={gender}
            onChange={setGender}
          />

          <DropdownSelect
            label="Курс"
            options={['1', '2', '3', '4', '5']}
            value={course}
            onChange={handleCourseChange}
          />

          <LabeledInput
            label="Группа"
            maxLength={15}
            value={group}
            onChange={handleInputChange(setGroup)}
          />

          <DropdownSelect
            label="Факультет"
            options={faculties.map(fac => fac.name)}
            value={faculty}
            onChange={handleFacultyChange}
          />

          <DropdownSelect
            label="Направление"
            options={majors}
            value={major}
            onChange={handleMajorChange}
          />

          <RegistrationButton onClick={handleSubmit} />
          {/* TODO Fix button placement */}
        </Card>
      </Space>
    </div>
  );
};

export default RegistrationWidget;
