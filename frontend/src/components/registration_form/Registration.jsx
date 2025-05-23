import React, { useState, useRef, useEffect } from 'react';
import { Card, Space, Typography, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import LabeledInput from '../profile_form/LabeledInput';
import PasswordInput from './Password_input';
import RegistrationButton from './Registration_button';
import DropdownSelect from '../profile_form/DropdownSelect';
import EmployerLogoUpload from './EmployerLogoUpload';

const { TabPane } = Tabs;

const RegistrationWidget = () => {
  const [activeTab, setActiveTab] = useState('student');
  
  // Student
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [gender, setGender] = useState(null);
  const [course, setCourse] = useState(null);
  const [group, setGroup] = useState('');
  const [faculty, setFaculty] = useState(null);
  const [major, setMajor] = useState(null);
  
  // Employer
  const [employerLogin, setEmployerLogin] = useState('');
  const [employerPassword, setEmployerPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [employerEmail, setEmployerEmail] = useState('');
  const [employerPhone, setEmployerPhone] = useState('');
  const [employerTelegram, setEmployerTelegram] = useState('');
  const [employerLogo, setEmployerLogo] = useState(null);

  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [registrationError, setRegistrationError] = useState(false);

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

  const handleTabChange = (key) => {
    setRegistrationError(false);
    setActiveTab(key);
  };

  const convertGenderToBackendFormat = (gender) => {
    if (gender === 'Мужской') return 'male';
    if (gender === 'Женский') return 'female';
    return gender;
  };

  const handleSubmit = async () => {
  if (activeTab === 'student') {
    const studentData = {
      login: login,
      password: password,
      first_name: firstName,
      last_name: lastName,
      middle_name: middleName,
      date_of_birth: dob,
      email: email,
      phone: phone,
      telegram: telegram,
      gender: convertGenderToBackendFormat(gender),
      course: course,
      group: group,
      faculty_name: faculty,
      major_name: major,
    };

    try {
      await axios.post('http://127.0.0.1:8000/students/add', studentData);
      setRegistrationError(false);
      navigate('/auth');
    } catch (error) {
      setRegistrationError(true);
      if (cardRef.current) cardRef.current.scrollTop = 0;
    }

  } else if (activeTab === 'employer') {
    const employerData = {
      login: employerLogin,
      password: employerPassword,
      company_name: companyName,
      email: employerEmail,
      phone: employerPhone,
      telegram: employerTelegram,
    };

    try {
      await axios.post('http://127.0.0.1:8000/employers/add', employerData);
      setRegistrationError(false);

      if (employerLogo && employerLogo.size <= 200 * 1024) {
        const formData = new FormData();
        formData.append('file', employerLogo);

        try {
          await axios.post(`http://127.0.0.1:8000/files/upload_logo/${companyName}`, formData);
        } catch (uploadError) {
          console.error('Ошибка загрузки логотипа:', uploadError);
        }
      }

      navigate('/auth');
    } catch (registrationError) {
      setRegistrationError(true);
      if (cardRef.current) cardRef.current.scrollTop = 0;
    }
  }
};

  return (
    <div className="w-screen h-screen grid place-content-center px-4" style={{ backgroundColor: '#002040' }}>
      <Space direction="vertical" size={16}>
        <Card
          ref={cardRef}
          title="Регистрация"
          className="w-[90vw] sm:w-[500px] md:w-[570px] lg:w-[700px] xl:w-[750px] rounded-lg overflow-y-auto card-scroll"
          style={{
            maxHeight: '80vh',
            backgroundColor: '#343F4D',
            border: '1px solid #283144',
            color: 'white',
          }}
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
        >
          <Tabs 
            className="custom-tabs"
            defaultActiveKey="student" 
            onChange={handleTabChange} 
            centered>
              <TabPane tab="Студент" key="student">
                {registrationError && (
                  <div className="mb-4 ml-42">
                    <Typography.Text type="danger">
                      Введены некорректные данные
                    </Typography.Text>
                  </div>
                )}

                <LabeledInput label="Логин" maxLength={40} value={login} onChange={handleInputChange(setLogin)} />
                <PasswordInput onChange={handleInputChange(setPassword)} />
                <LabeledInput label="Имя" maxLength={100} value={firstName} onChange={handleInputChange(setFirstName)} />
                <LabeledInput label="Фамилия" maxLength={100} value={lastName} onChange={handleInputChange(setLastName)} />
                <LabeledInput label="Отчество (опционально)" maxLength={100} value={middleName} onChange={handleInputChange(setMiddleName)} />
                <LabeledInput label="Дата рождения (ДД.ММ.ГГГГ)" maxLength={10} value={dob} onChange={handleInputChange(setDob)} mask="00.00.0000" />
                <LabeledInput label="Электронная почта" maxLength={100} value={email} onChange={handleInputChange(setEmail)} />
                <LabeledInput label="Телефон" maxLength={11} value={phone} onChange={handleInputChange(setPhone)} />
                <LabeledInput label="Телеграм (опционально)" maxLength={100} value={telegram} onChange={handleInputChange(setTelegram)} />
                <DropdownSelect label="Пол" options={['Мужской', 'Женский']} value={gender} onChange={setGender} />
                <DropdownSelect label="Курс" options={['1', '2', '3', '4', '5']} value={course} onChange={handleCourseChange} />
                <LabeledInput label="Группа" maxLength={15} value={group} onChange={handleInputChange(setGroup)} />
                <DropdownSelect label="Факультет" options={faculties.map(fac => fac.name)} value={faculty} onChange={handleFacultyChange} />
                <DropdownSelect label="Направление" options={majors} value={major} onChange={handleMajorChange} />
              </TabPane>

              <TabPane tab="Работодатель" key="employer">
                {registrationError && (
                  <div className="mb-4 ml-42">
                    <Typography.Text type="danger">
                      Введены некорректные данные
                    </Typography.Text>
                  </div>
                )}

                <LabeledInput label="Логин" maxLength={40} value={employerLogin} onChange={handleInputChange(setEmployerLogin)} />
                <PasswordInput onChange={handleInputChange(setEmployerPassword)} />
                <LabeledInput label="Название компании" maxLength={100} value={companyName} onChange={handleInputChange(setCompanyName)} />
                <LabeledInput label="Электронная почта" maxLength={100} value={employerEmail} onChange={handleInputChange(setEmployerEmail)} />
                <LabeledInput label="Телефон" maxLength={11} value={employerPhone} onChange={handleInputChange(setEmployerPhone)} />
                <LabeledInput label="Телеграм (опционально)" maxLength={100} value={employerTelegram} onChange={handleInputChange(setEmployerTelegram)} />
                <EmployerLogoUpload onFileSelect={setEmployerLogo} />
              </TabPane>
          </Tabs>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <RegistrationButton onClick={handleSubmit} />
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default RegistrationWidget;
