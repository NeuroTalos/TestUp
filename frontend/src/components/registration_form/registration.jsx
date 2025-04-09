import React, { useState } from 'react';;
import { Card, Space } from 'antd';
import TextInput from './text_input';
import PasswordInput from './password_input';
import GenderChoice from './gender_choice';
import StudyInfoInput from './study_info_choice';
import FacultyMajorInput from './faculty_major_choice';
import RegistrationButton from './registration_button';
import axios from 'axios';

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

  const handleInputChange = (setter) => (e) => setter(e.target.value);
  
  const handleCourseChange = (value) => {
    setCourse(value);
  };

  const handleFacultyChange = (value) => {
    setFaculty(value);
  };

  const handleMajorChange = (value) => {
    setMajor(value);
  };
  
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

    console.log(formData)

    axios.post('http://127.0.0.1:8000/students', formData)
        .then(response => {
            // Обрабатываем успешный ответ от сервера
            console.log('Ответ от сервера:', response.data);
            alert('Регистрация прошла успешно!');
        })
        .catch(error => {
            // Обрабатываем ошибку при запросе
            console.error('Ошибка при отправке данных:', error);
            alert('Произошла ошибка при регистрации. Попробуйте снова.');
        });

  };  

  return(
    <div className="w-screen h-screen grid place-content-center bg-linear-to-t from-sky-500 to-indigo-500">
      <Space direction="vertical" size={16}>
        <Card 
          title={<div style={{ textAlign: "center", fontWeight: "bold", fontSize: 24 }}>Регистрация</div>}
          style={{ 
            width: 600, 
            maxHeight: "80vh",
          }}
          className="border-2 border-black rounded-lg overflow-y-auto"
          >
            <TextInput
              placeholder={"Логин"}
              maxLength={40}
              onChange={handleInputChange(setLogin)}
            />

            <PasswordInput
              onChange={handleInputChange(setPassword)}
            />

            <TextInput
              placeholder={"Имя"}
              maxLength={100}
              onChange={handleInputChange(setFirstName)}
            />

            <TextInput
              placeholder={"Фамилия"}
              maxLength={100}
              onChange={handleInputChange(setLastName)}
            />

            <TextInput
              placeholder={"Отчество (опционально)"}
              maxLength={100}
              onChange={handleInputChange(setMiddleName)}
            />

            <TextInput
              placeholder={"Дата рождения (ДД.ММ.ГГГГ)"}
              maxLength={10}
              onChange={handleInputChange(setDob)}
            />

            <TextInput
              placeholder={"Электронная почта"}
              maxLength={100}
              onChange={handleInputChange(setEmail)}
            />

            <TextInput
              placeholder={"Телефон"}
              maxLength={11}
              onChange={handleInputChange(setPhone)}
            />

            <GenderChoice
              onChange={handleInputChange(setGender)}
            />

            <StudyInfoInput
              onChangeCourse={handleCourseChange}
              onChangeGroup={handleInputChange(setGroup)}
            />

            <FacultyMajorInput
              onChangeFaculty={handleFacultyChange}
              onChangeMajor={handleMajorChange}
            />

            <RegistrationButton
               onClick={handleSubmit}
            />


        </Card>
      </Space>
    </div>
  );
};
export default RegistrationWidget;