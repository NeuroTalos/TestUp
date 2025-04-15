import React, { useContext } from 'react';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Menu, Avatar, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Sidebar = ({ selectedKey, onSelect, fullName }) => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    return (
        <div className="h-screen w-80 flex flex-col shadow" style={{ backgroundColor: '#002040' }}>
            <div className="flex flex-col items-center px-6 py-6 text-white">
                <Avatar size={64} icon={<UserOutlined style={{ fontSize: '32px' }} />} />
                <div className="mt-5 text-center text-base font-semibold leading-tight">
                    {fullName}
                </div>
            </div>

            <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                onClick={({ key }) => onSelect(key)}
                className="flex-1 text-white"
                style={{ 
                    backgroundColor: '#002040',
                    border: 'none',
                    boxShadow: 'none',
                }}
            >
                <Menu.Item key="info" style={{ color: 'white', fontSize: '16px', borderBottom: 'none'}}>
                    Основная информация
                </Menu.Item>
                <Menu.Item key="tasks" style={{ color: 'white', fontSize: '16px', borderBottom: 'none' }}>
                    Задания
                </Menu.Item>
            </Menu>

            <div className="p-4">
                <div>
                    <Button
                        type="primary"
                        danger
                        shape="round"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        className="w-35"
                    >
                        Выйти
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
