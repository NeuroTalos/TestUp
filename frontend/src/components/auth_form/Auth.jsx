import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LabeledInput from '../profile_form/LabeledInput';
import PasswordInput from '../registration_form/Password_input';
import { Card, Space, Input, Col, Row, Button, Flex, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Text, Link } = Typography;

const AuthWidget = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleInputChange = (setter) => (e) => setter(e.target.value);

  const handleRegisterClick = () => navigate('/registration');

  const handleSubmit = () => {
    const formData = {
      login: loginInput,
      password: passwordInput,
    };

    axios.post(`${API_URL}/auth/login`, formData)
      .then((response) => {
        const userRole = response.data.role;
        setAuthError(false);
        login(userRole);
        navigate('/');
      })
      .catch(() => {
        setAuthError(true);
      });
  };

  const handlePasswordReset = () => {
    axios.post(`${API_URL}/email/send_email`, { email: emailInput })
      .then(() => {
        setResetSuccess(true);
        setAuthError(false);
        setIsButtonDisabled(true);
        setCooldown(60);

        const interval = setInterval(() => {
          setCooldown(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsButtonDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      })
      .catch(() => {
        setResetSuccess(false);
        setAuthError(true);
      });
  };

  return (
    <div className="w-screen h-screen grid place-content-center px-4 overflow-hidden" style={{ backgroundColor: '#002040' }}>
      <Space direction="vertical" size={16}>
        <Card
          title={<div style={{ textAlign: "center", fontWeight: "bold", fontSize: 24, color: 'white' }}>Авторизация</div>}
          style={{
            width: '90vw', 
            maxWidth: 450, 
            maxHeight: "80vh",
            backgroundColor: '#343F4D',
            border: '1px solid #283144',
            color: 'white',
          }}
          className="border-2 border-black rounded-lg overflow-y-auto"
          styles={{
            header: {
              borderBottom: '2px solid #283144',
              color: 'white',
              backgroundColor: '#343F4D',
            },
          }}
        >
          {!isResetMode ? (
            <>
              <LabeledInput label="Логин" maxLength={40} value={loginInput} onChange={handleInputChange(setLoginInput)} />
              <PasswordInput onChange={handleInputChange(setPasswordInput)} />
              {authError && (
                <div style={{ marginBottom: 16 }}>
                  <Text type="danger">Неверный логин или пароль</Text>
                </div>
              )}
              <Row gutter={8} justify="start" style={{ marginTop: 16 }}>
                <Col>
                  <Button type="primary" onClick={handleSubmit}>
                    Войти
                  </Button>
                </Col>
                <Col>
                  <Button type="primary" onClick={handleRegisterClick}>
                    Зарегистрироваться
                  </Button>
                </Col>
              </Row>

              <div style={{ marginTop: 12 }}>
                <Link onClick={() => setIsResetMode(true)} style={{ color: '#1890ff' }}>
                  Забыли пароль?
                </Link>
              </div>
            </>
          ) : (
            <>
              <LabeledInput
                label="Введите email для восстановления доступа"
                maxLength={60}
                value={emailInput}
                onChange={handleInputChange(setEmailInput)}
              />
              {resetSuccess && (
                <Text type="success" style={{ marginBottom: 16 }}>
                  Инструкции отправлены на ваш email
                </Text>
              )}
              {authError && (
                <Text type="danger" style={{ marginBottom: 16 }}>
                  Ошибка при отправке. Попробуйте ещё раз.
                </Text>
              )}
              <Row gutter={8} justify="start" style={{ marginTop: 16 }}>
                <Col>
                  <Button
                    type="primary"
                    onClick={handlePasswordReset}
                    disabled={isButtonDisabled}
                  >
                    {isButtonDisabled ? `Повтор через ${cooldown}с` : 'Отправить'}
                  </Button>
                </Col>
                <Col>
                  <Button type="primary" onClick={() => {
                    setIsResetMode(false);
                    setEmailInput('');
                    setAuthError(false);
                    setResetSuccess(false);
                  }}>
                    Назад
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Card>
      </Space>
    </div>
  );
};

export default AuthWidget;
