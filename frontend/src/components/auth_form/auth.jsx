import React, { useState, useContext } from 'react';;
import { AuthContext } from '../contexts/AuthContext';
import LabeledInput from '../profile_form/LabeledInput';
import PasswordInput from '../registration_form/Password_input';
import { Card, Space, Input, Col, Row, Button, Flex, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Text } = Typography;

const AuthWidget = () => {
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleInputChange = (setter) => (e) => setter(e.target.value);

  const handleRegisterClick = () => {
    navigate('/registration');
  };

  const handleSubmit = () => {
    const formData = {
      "login": loginInput,
      "password" : passwordInput,

    };

    axios.post('http://127.0.0.1:8000/auth/login', formData)
        .then(response => {
            const userRole = response.data.role; 
            setAuthError(false);
            login(userRole);
            navigate('/');
        })
        .catch(error => {
            setAuthError(true);
        });

  };  

  return(
    <div 
      className="w-screen h-screen grid place-content-center px-4"
      style={{ backgroundColor: '#002040' }}
    >
      <Space direction="vertical" size={16}>
        <Card 
          title={<div style={{ textAlign: "center", fontWeight: "bold", fontSize: 24, color: 'white' }}>Авторизация</div>}
          style={{ 
            width: 450, 
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
            <LabeledInput label="Логин" maxLength={40} value={loginInput} onChange={handleInputChange(setLoginInput)} />

            <PasswordInput onChange={handleInputChange(setPasswordInput)} />

            {authError && (
              <div style={{ marginBottom: 16 }}>
                <Text type="danger">Неверный логин или пароль</Text>
              </div>
            )}

            <div className="mt-5">
              <Row className="ml-15">
                <Col span={8}>
                  <Flex gap="small" wrap>
                      <Button 
                        type="primary"
                        onClick={handleSubmit}
                      >
                        Войти
                      </Button>
                  </Flex>
                </Col>
                <Col span={12}>
                  <Flex gap="small" wrap>
                      <Button 
                        type="primary"
                        onClick={handleRegisterClick}
                      >
                        Зарегистрироваться
                      </Button>
                  </Flex>
                </Col>
              </Row>
            </div>

        </Card>
      </Space>
    </div>
  );
};
export default AuthWidget;