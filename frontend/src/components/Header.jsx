import React, { useContext } from 'react';
import { Button, Menu, Dropdown } from 'antd';
import { UserAddOutlined, LoginOutlined, UserOutlined, DownOutlined, LogoutOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { useMediaQuery } from 'react-responsive';

const Header = () => {
  const { isAuthenticated, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery({ maxWidth: 780 });

  const menuStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#001529',
    padding: '0 20px',
    height: '55px',
  };

  const handleProfileMenuClick = (e) => {
    if (e.key === '1') {
      navigate('/profile');
    } else if (e.key === '2') {
      logout();
      navigate('/');
    }
  };

  const ProfileMenu = {
    items: [
      {
        label: 'Профиль',
        key: '1',
        icon: <UserOutlined />,
      },
      {
        label: 'Выйти',
        key: '2',
        icon: <LogoutOutlined />,
      },
    ],
    onClick: handleProfileMenuClick,
  };

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

        <Menu.Item key="main_page">
          <Link to="/"
            style={{ 
              textDecoration: 'none' ,
              fontSize: '20px',
              fontWeight: '400',
              color: 'inherit',
            }}>
            Главная страница
          </Link>
        </Menu.Item>

        <div style={{ width: '20px' }} />

        <Menu.Item key="tasks">
          <Link to="/tasks"
            style={{ 
              textDecoration: 'none' ,
              fontSize: '20px',
              fontWeight: '400',
              color: 'inherit',
              marginLeft: '30px'
            }}>
            Список заданий
          </Link>
        </Menu.Item>

        <Menu.Item key="companies" >
          <Link to="/"
            style={{ 
              textDecoration: 'none' ,
              fontSize: '20px',
              fontWeight: '400',
              color: 'inherit',
              marginLeft: '30px'
            }}>
            Компании-партнёры
          </Link>
        </Menu.Item>
      </Menu>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isAuthenticated && role === 'employer' && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginRight: 15 }}
            onClick={() => navigate('/tasks/add')}
          >
            
            {!isSmallScreen && 'Создать задание'}
          </Button>
        )}

        {isAuthenticated ? (
          <Dropdown menu={ProfileMenu} trigger={['click']}>
              <Button
                icon={<UserOutlined />}
                type="default"
                shape="circle"
                size="large"
                style={{
                  marginRight: 15,
                  backgroundColor: '#001529',
                  color: '#fff',
                  borderColor: '#001529',
                  boxShadow: 'none',
                }}
              >
                <DownOutlined style={{ marginLeft: '5px' }} />
              </Button>
          </Dropdown>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
