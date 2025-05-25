import React, { useContext, useState } from 'react';
import { Button, Menu, Dropdown, Drawer } from 'antd';
import {
  UserAddOutlined,
  LoginOutlined,
  UserOutlined,
  LogoutOutlined,
  PlusOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { useMediaQuery } from 'react-responsive';
import { toast } from 'react-toastify';

const Header = () => {
  const { isAuthenticated, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery({ maxWidth: 1050 });

  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleProfileMenuClick = ({ key }) => {
    if (key === 'profile') {
      navigate('/profile');
    } else if (key === 'logout') {
      logout();
      navigate('/');
    }
    setDrawerVisible(false);
  };

  const profileMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined style={{ color: 'white' }} />,
      label: 'Профиль',
      style: { color: 'white' },
    },
    {
      key: 'logout',
      icon: <LogoutOutlined style={{ color: 'white' }} />,
      label: 'Выйти',
      style: { color: 'white' },
    },
  ];

  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const handleTasksNavigation = () => {
    if (!isAuthenticated) {
      toast.warn('Пожалуйста, авторизуйтесь или зарегистрируйтесь, чтобы просматривать задания.', {
        autoClose: 3000,
        className: 'custom-toast-error',
      });
    } else {
      navigate(role === 'student' ? '/tasks' : '/employer/tasks');
      closeDrawer();
    }
  };

  const desktopMenu = (
    <Menu mode="horizontal" theme="dark" selectable={false} style={{ flex: 1 }}>
      <Menu.Item key="home" style={{ cursor: 'pointer' }}>
        <Link to="/" style={{ color: 'inherit' }}>
          <img src="/logo.png" alt="Logo" style={{ height: 32, marginTop: 8 }} />
        </Link>
      </Menu.Item>

      <Menu.Item key="main_page">
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            fontSize: 20,
            fontWeight: 400,
            color: 'inherit',
          }}
        >
          Главная страница
        </Link>
      </Menu.Item>

      {role === 'student' && (
        <Menu.Item
          key="tasks"
          style={{ cursor: 'pointer', marginLeft: 30 }}
          onClick={handleTasksNavigation}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: 'inherit',
            }}
          >
            Список заданий
          </span>
        </Menu.Item>
      )}

      {role === 'employer' && (
        <Menu.Item key="employer-tasks" style={{ marginLeft: 30 }}>
          <Link
            to="/employer/tasks"
            style={{ color: 'inherit', textDecoration: 'none', fontSize: 20, fontWeight: 400 }}
          >
            Размещённые задания
          </Link>
        </Menu.Item>
      )}

      <Menu.Item key="companies" style={{ marginLeft: 30 }}>
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            fontSize: 20,
            fontWeight: 400,
            color: 'inherit',
          }}
        >
          Компании-партнёры
        </Link>
      </Menu.Item>
    </Menu>
  );

  const drawerMenuItems = [
    {
      key: 'home',
      label: (
        <Link to="/" onClick={closeDrawer} style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
          <img src="/logo.png" alt="Logo" style={{ height: 32, marginRight: 8 }} />
        </Link>
      ),
    },
    {
      key: 'main_page',
      label: (
        <Link to="/" onClick={closeDrawer} style={{ color: 'white' }}>
          Главная страница
        </Link>
      ),
    },
    ...(role === 'student'
      ? [
          {
            key: 'tasks',
            label: (
              <span
                onClick={handleTasksNavigation}
                style={{ cursor: 'pointer', color: 'white' }}
              >
                Список заданий
              </span>
            ),
          },
        ]
      : []),
    ...(role === 'employer'
      ? [
          {
            key: 'employer-tasks',
            label: (
              <Link
                to="/employer/tasks"
                onClick={closeDrawer}
                style={{ color: 'white', cursor: 'pointer' }}
              >
                Размещённые задания
              </Link>
            ),
          },
        ]
      : []),
    {
      key: 'companies',
      label: (
        <Link to="/" onClick={closeDrawer} style={{ color: 'white' }}>
          Компании-партнёры
        </Link>
      ),
    },
  ];

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#001529',
        padding: '0 20px',
        height: 55,
      }}
    >
      {!isSmallScreen && desktopMenu}

      {isSmallScreen && (
        <Button
          type="text"
          icon={<MenuOutlined style={{ fontSize: 24, color: '#fff' }} />}
          onClick={openDrawer}
          style={{ marginRight: 10 }}
          aria-label="Открыть меню"
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isAuthenticated && role === 'employer' && !isSmallScreen && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginRight: 15, whiteSpace: 'nowrap' }}
            onClick={() => navigate('/tasks/add')}
          >
            Создать задание
          </Button>
        )}

        {isAuthenticated ? (
          <Dropdown
            overlay={
              <Menu
                items={profileMenuItems}
                onClick={handleProfileMenuClick}
                style={{ backgroundColor: '#001529', borderRadius: 8, minWidth: 140 }}
              />
            }
            trigger={['click']}
            placement="bottomRight"
            arrow
          >
            <Button
              type="text"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.5)',
                border: 'none',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s ease',
                marginRight: 12,
              }}
              onClick={e => e.preventDefault()}
              aria-label="Меню пользователя"
            >
              <UserOutlined style={{ fontSize: 20, color: 'white' }} />
            </Button>
          </Dropdown>
        ) : (
          <>
            <Button
              icon={<UserAddOutlined />}
              style={{
                marginRight: 20,
                borderRadius: 6,
                border: '1.5px solid #3b82f6',
                backgroundColor: 'transparent',
                color: '#3b82f6',
                fontWeight: 600,
                padding: '6px 16px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#3b82f6';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => navigate('/registration')}
            >
              Зарегистрироваться
            </Button>

            <Button
              type="primary"
              icon={<LoginOutlined />}
              style={{
                marginRight: 15,
                borderRadius: 6,
                fontWeight: 600,
                padding: '6px 20px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#1e40af';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,64,175,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => navigate('/auth')}
            >
              Войти
            </Button>
          </>
        )}
      </div>

      <Drawer
        placement="left"
        onClose={closeDrawer}
        open={drawerVisible}
        bodyStyle={{ padding: 0, backgroundColor: '#002040', color: 'white' }}
        headerStyle={{ backgroundColor: '#002040', borderBottom: 'none' }}
        closeIcon={null}
        aria-label="Боковое меню"
      >
        <Menu
          mode="inline"
          selectable={false}
          items={drawerMenuItems}
          style={{
            borderRight: 'none',
            backgroundColor: '#002040',
            color: 'white',
            fontSize: 16,
            fontWeight: 500,
          }}
        />

        {isAuthenticated && role === 'employer' && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ margin: 16, width: 'calc(100% - 32px)' }}
            onClick={() => {
              navigate('/tasks/add');
              closeDrawer();
            }}
          >
            Создать задание
          </Button>
        )}

        {isAuthenticated ? (
          <Menu
            mode="inline"
            selectable={false}
            items={profileMenuItems}
            onClick={({ key }) => {
              if (key === 'profile') {
                navigate('/profile');
              } else if (key === 'logout') {
                logout();
                navigate('/');
              }
              closeDrawer();
            }}
            style={{ borderRight: 'none', backgroundColor: '#002040', color: 'white' }}
          />
        ) : (
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button
              icon={<UserAddOutlined />}
              style={{
                borderRadius: 6,
                border: '1.5px solid #3b82f6',
                backgroundColor: 'transparent',
                color: '#3b82f6',
                fontWeight: 600,
                padding: '6px 16px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#3b82f6';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => {
                navigate('/registration');
                closeDrawer();
              }}
            >
              Зарегистрироваться
            </Button>
            <Button
              type="primary"
              icon={<LoginOutlined />}
              style={{
                borderRadius: 6,
                fontWeight: 600,
                padding: '6px 20px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#1e40af';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,64,175,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => {
                navigate('/auth');
                closeDrawer();
              }}
            >
              Войти
            </Button>
          </div>
        )}
      </Drawer>
    </header>
  );
};

export default Header;
