import React from 'react';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const PasswordSetPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const onFinish = async ({ password }) => {
    if (!token) {
      message.error('Отсутствует токен сброса пароля');
      return;
    }

    try {
      await axios.post('http://localhost:8000/password_reset/update_password', {
        token,
        new_password: password,
      });

      message.success('Пароль успешно обновлен');
      navigate('/auth');
    } catch (error) {
      if (error.response?.data?.detail) {
        message.error(error.response.data.detail);
      } else {
        message.error('Ошибка сети или сервера');
      }
    }
  };

  return (
    <div className="w-screen min-h-screen grid place-content-center px-4" style={{ backgroundColor: '#002040' }}>
      <Card
        title={
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 24, color: 'white' }}>
            Установка нового пароля
          </div>
        }
        style={{
          width: 450,
          backgroundColor: '#343F4D',
          border: '1px solid #283144',
          color: 'white',
        }}
        className="rounded-lg overflow-y-auto"
        headStyle={{
          borderBottom: '2px solid #283144',
          color: 'white',
          backgroundColor: '#343F4D',
        }}
      >
        <Text style={{ display: 'block', marginBottom: 24, textAlign: 'center', color: '#cccccc' }}>
          Пожалуйста, введите новый пароль для вашей учетной записи.
        </Text>

        <Form name="set_new_password" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<span style={{ color: 'white' }}>Новый пароль</span>}
            name="password"
            rules={[
              { required: true, message: 'Пожалуйста, введите новый пароль' },
              { message: 'Пароль должен содержать минимум 6 символов' },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.5)' }} />}
              size="large"
              autoComplete="new-password"
              style={{ backgroundColor: '#2A333D', color: 'white', borderColor: '#414D5A' }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: 'white' }}>Подтвердите пароль</span>}
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Пожалуйста, подтвердите пароль' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(255, 255, 255, 0.5)' }} />}
              size="large"
              autoComplete="new-password"
              style={{ backgroundColor: '#2A333D', color: 'white', borderColor: '#414D5A' }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{ backgroundColor: '#1677ff', borderColor: '#1677ff' }}
            >
              Установить пароль
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PasswordSetPage;
