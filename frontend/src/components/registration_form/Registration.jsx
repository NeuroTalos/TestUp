import React, { useState, useRef, useEffect } from 'react';
import { Card, Space, Typography, Tabs, Button, Input, Checkbox, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import LabeledInput from '../profile_form/LabeledInput';
import PasswordInput from './Password_input';
import DropdownSelect from '../profile_form/DropdownSelect';
import EmployerLogoUpload from './EmployerLogoUpload';

const { TabPane } = Tabs;

const RegistrationWidget = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [activeTab, setActiveTab] = useState('student');

  // Student fields
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

  // Employer fields
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

  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [cooldown, setCooldown] = useState(60);
  const cooldownRef = useRef(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);

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
        const response = await axios.get(`${API_URL}/faculties`);
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

  useEffect(() => {
    if (cooldown === 0) {
      clearInterval(cooldownRef.current);
    }
  }, [cooldown]);

  const startCooldown = () => {
    setCooldown(60);
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTabChange = (key) => {
    setRegistrationError(false);
    setVerificationStep(false);
    setActiveTab(key);
  };

  const convertGenderToBackendFormat = (gender) => {
    if (gender === 'Мужской') return 'male';
    if (gender === 'Женский') return 'female';
    return gender;
  };

  const sendVerificationCode = async () => {
    setRegistrationError(false);
    setTermsError(false);

    let targetEmail = activeTab === 'student' ? email : employerEmail;

    const validateStudentFields = () => {
      return (
        login.trim() &&
        password.trim() &&
        firstName.trim() &&
        lastName.trim() &&
        dob.trim() &&
        email.trim() &&
        phone.trim() &&
        gender &&
        course &&
        group.trim() &&
        faculty &&
        major
      );
    };

    const validateEmployerFields = () => {
      return (
        employerLogin.trim() &&
        employerPassword.trim() &&
        companyName.trim() &&
        employerEmail.trim() &&
        employerPhone.trim()
      );
    };

    if (!targetEmail) {
      setRegistrationError(true);
      return;
    }

    if (!agreeToTerms) {
      setTermsError(true);
      return;
    }

    if (activeTab === 'student' && !validateStudentFields()) {
      setRegistrationError(true);
      return;
    }

    if (activeTab === 'employer' && !validateEmployerFields()) {
      setRegistrationError(true);
      return;
    }

    try {
      await axios.post(`${API_URL}/email/send_verification_code`, { email: targetEmail });
      setVerificationStep(true);
      startCooldown();
    } catch (error) {
      setRegistrationError(true);
      if (cardRef.current) cardRef.current.scrollTop = 0;
    }
  };


  const handleResendCode = () => {
    if (cooldown === 0) {
      sendVerificationCode();
    }
  };

  const handleConfirm = async () => {
    setRegistrationError(false);

    try {
      if (activeTab === 'student') {
        const studentData = {
          login,
          password,
          first_name: firstName,
          last_name: lastName,
          middle_name: middleName,
          date_of_birth: dob,
          email,
          phone,
          telegram,
          gender: convertGenderToBackendFormat(gender),
          course,
          group,
          faculty_name: faculty,
          major_name: major,
        };

        await axios.post(
          `${API_URL}/students/add?verification_code=${verificationCode}`,
          studentData
        );

      } else if (activeTab === 'employer') {
        const employerData = {
          login: employerLogin,
          password: employerPassword,
          company_name: companyName,
          email: employerEmail,
          phone: employerPhone,
          telegram: employerTelegram,
        };

        await axios.post(
          `${API_URL}/employers/add?verification_code=${verificationCode}`,
          employerData
        );

        if (employerLogo && employerLogo.size <= 200 * 1024) {
          const formData = new FormData();
          formData.append('file', employerLogo);

          try {
            await axios.post(`${API_URL}/files/upload_logo/${companyName}`, formData);
          } catch (uploadError) {
            console.error('Ошибка загрузки логотипа:', uploadError);
          }
        }
      }

      setRegistrationError(false);
      navigate('/auth');
    } catch (error) {
      setRegistrationError(true);
      if (cardRef.current) cardRef.current.scrollTop = 0;
    }
  };

  return (
    <div className="w-screen h-screen grid place-content-center px-4" style={{ backgroundColor: '#002040' }}>
      <Space direction="vertical" size={16}>
        <Card
          ref={cardRef}
          title={<div style={{ textAlign: "center", fontWeight: "bold", fontSize: 24, color: 'white' }}>Регистрация</div>}
          className="w-[90vw] sm:w-[500px] md:w-[570px] lg:w-[700px] xl:w-[750px] border-2 border-black rounded-lg overflow-y-auto card-scroll"
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
            },
          }}
        >
          {!verificationStep ? (
            <Tabs
              className="custom-tabs"
              defaultActiveKey="student"
              onChange={handleTabChange}
              centered
              activeKey={activeTab}
            >
              <TabPane tab="Студент" key="student">
                {registrationError && (
                  <div style={{ marginBottom: 16, textAlign: 'center' }}>
                    <Typography.Text type="danger">
                      Введены некорректные данные
                    </Typography.Text>
                  </div>
                )}

                <LabeledInput label="Логин" minLength={6} maxLength={40} value={login} onChange={handleInputChange(setLogin)} />
                <PasswordInput minLength={6} onChange={handleInputChange(setPassword)} />
                <LabeledInput label="Имя" maxLength={40} value={firstName} onChange={handleInputChange(setFirstName)} />
                <LabeledInput label="Фамилия" maxLength={40} value={lastName} onChange={handleInputChange(setLastName)} />
                <LabeledInput label="Отчество (опционально)" maxLength={40} value={middleName} onChange={handleInputChange(setMiddleName)} />
                <LabeledInput label="Дата рождения (ДД.ММ.ГГГГ)" maxLength={10} value={dob} onChange={handleInputChange(setDob)} mask="00.00.0000" />
                <LabeledInput label="Электронная почта" maxLength={50} value={email} onChange={handleInputChange(setEmail)} />
                <LabeledInput label="Телефон" maxLength={11} value={phone} only_number={true} onChange={handleInputChange(setPhone)} />
                <LabeledInput label="Телеграм (опционально)" maxLength={40} value={telegram} onChange={handleInputChange(setTelegram)} />
                <DropdownSelect label="Пол" options={['Мужской', 'Женский']} value={gender} onChange={setGender} />
                <DropdownSelect label="Курс" options={['1', '2', '3', '4', '5']} value={course} onChange={handleCourseChange} />
                <LabeledInput label="Группа" maxLength={15} value={group} onChange={handleInputChange(setGroup)} />
                <DropdownSelect label="Факультет" options={faculties.map(fac => fac.name)} value={faculty} onChange={handleFacultyChange} />
                <DropdownSelect label="Направление" options={majors} value={major} onChange={handleMajorChange} />
                
                {!registrationError && termsError && (
                  <div style={{ marginBottom: 16, textAlign: 'center' }}>
                    <Typography.Text type="danger">
                      Необходимо согласиться с правилами пользования и политикой конфиденциальности
                    </Typography.Text>
                  </div>
                )}

                <Checkbox
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  style={{ color: 'white', marginTop: 16 }}
                >
                  Я соглашаюсь с <Link to="/terms" style={{ color: '#1890ff' }}>правилами пользования</Link> и <Link to="/privacy" style={{ color: '#1890ff' }}>политикой конфиденциальности</Link>
                </Checkbox>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                  <Button type="primary" onClick={sendVerificationCode}>
                    Зарегистрироваться
                  </Button>
                </div>
              </TabPane>

              <TabPane tab="Работодатель" key="employer">
                {registrationError && (
                  <div style={{ marginBottom: 16, textAlign: 'center' }}>
                    <Typography.Text type="danger">
                      Введены некорректные данные
                    </Typography.Text>
                  </div>
                )}

                <LabeledInput label="Логин" minLength={6} maxLength={40} value={employerLogin} onChange={handleInputChange(setEmployerLogin)} />
                <PasswordInput onChange={handleInputChange(setEmployerPassword)} />
                <LabeledInput label="Название компании" maxLength={50} value={companyName} onChange={handleInputChange(setCompanyName)} />
                <LabeledInput label="Электронная почта" maxLength={50} value={employerEmail} onChange={handleInputChange(setEmployerEmail)} />
                <LabeledInput label="Телефон" maxLength={11} value={employerPhone} only_number={true} onChange={handleInputChange(setEmployerPhone)} />
                <LabeledInput label="Телеграм (опционально)" maxLength={40} value={employerTelegram} onChange={handleInputChange(setEmployerTelegram)} />

                <EmployerLogoUpload onFileSelect={setEmployerLogo} />

                {!registrationError && termsError && (
                  <div style={{ marginBottom: 16, textAlign: 'center' }}>
                    <Typography.Text type="danger">
                      Необходимо согласиться с правилами пользования и политикой конфиденциальности
                    </Typography.Text>
                  </div>
                )}

                <Checkbox
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  style={{ color: 'white', marginTop: 16 }}
                >
                  Я соглашаюсь с <Link to="/terms" style={{ color: '#1890ff' }}>правилами пользования</Link> и <Link to="/privacy" style={{ color: '#1890ff' }}>политикой конфиденциальности</Link>
                </Checkbox>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                  <Button type="primary" onClick={sendVerificationCode}>
                    Зарегистрироваться
                  </Button>
                </div>
              </TabPane>
            </Tabs>
          ) : (
            <>
              <Typography.Title
                level={4}
                style={{ color: 'white', textAlign: 'center', marginBottom: 24 }}
              >
                Введите 4-значный код, отправленный на вашу почту
              </Typography.Title>

              <Input
                maxLength={4}
                value={verificationCode}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d{0,4}$/.test(val)) setVerificationCode(val);
                }}
                autoFocus
                style={{
                  fontSize: 28,
                  letterSpacing: 20,
                  textAlign: 'center',
                  borderRadius: 6,
                  border: '1.5px solid #555',
                  backgroundColor: '#2A2F3A',
                  color: 'white',
                  marginBottom: 24,
                }}
                placeholder="----"
              />

              {registrationError && (
                <Typography.Text type="danger" style={{ display: 'block', marginBottom: 16, textAlign: 'center' }}>
                  Неверный код
                </Typography.Text>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <Button
                  disabled={cooldown > 0}
                  onClick={handleResendCode}
                  style={{
                    flex: 1,
                    backgroundColor: cooldown > 0 ? '#555' : '#002040',
                    color: cooldown > 0 ? '#999' : '#3399FF',
                    fontWeight: 'bold',
                    height: 40,
                    borderRadius: 6,
                    border: '1.5px solid',
                    borderColor: cooldown > 0 ? '#999' : '#3b82f6',
                    transition: 'all 0.3s ease',
                    cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
                    boxShadow: cooldown > 0 ? 'none' : undefined,
                  }}
                  type="default"
                  onMouseEnter={e => {
                    if (cooldown === 0) {
                      e.currentTarget.style.backgroundColor = '#3b82f6';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.4)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (cooldown === 0) {
                      e.currentTarget.style.backgroundColor = '#002040';
                      e.currentTarget.style.color = '#3399FF';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {cooldown > 0 ? `Отправить повторно (${cooldown})` : 'Отправить повторно'}
                </Button>

                <Button
                  type="primary"
                  disabled={verificationCode.length !== 4}
                  onClick={handleConfirm}
                  style={{ flex: 1, height: 40 }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#004080';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,64,175,0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Подтвердить
                </Button>
              </div>
            </>
          )}
        </Card>
      </Space>
    </div>
  );
};

export default RegistrationWidget;
