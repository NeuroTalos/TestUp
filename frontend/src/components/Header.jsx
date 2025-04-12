import React, { useState } from 'react';
import { Button, Menu} from 'antd';
import { UserAddOutlined, LoginOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';


const Header = () => {
  const menuStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#001529',
    padding: '0 20px',
    height: '55px',
  };

  const navigate = useNavigate();

  return (
    <div style={menuStyle}>
      <Menu mode="horizontal" theme="dark" style={{ flex: 1 }} selectedKeys={[]}>
        <Menu.Item key="home" style={{ cursor: 'pointer' }}>
          <Link to="/" style={{ color: 'inherit' }}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{ height: '32px', marginTop: '8px' }}
            />
          </Link>
        </Menu.Item>

        <div style={{ width: '20px' }} />

        <Menu.Item key="tasks">
          <a href="#" 
            style={{ 
              textDecoration: 'none' ,
              fontSize: '20px',
              fontWeight: '400',
            }}>
            Список заданий
          </a>
        </Menu.Item>
      </Menu>

      <div>
        <Button 
          icon={<UserAddOutlined />} 
          style={{ marginRight: 20 }}
          onClick={() => navigate('/registration')}
        >
          Зарегистрироваться
        </Button>
        <Button 
        type="primary" 
        icon={<LoginOutlined />}
        style={{ marginRight: 15 }}
        onClick={() => navigate('/auth')}
        >
          Войти
        </Button>
      </div>
    </div>
  );
};

export default Header;
