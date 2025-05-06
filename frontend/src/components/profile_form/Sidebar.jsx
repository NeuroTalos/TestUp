import React, { useContext } from 'react';
import { LogoutOutlined, UserOutlined, BankOutlined } from '@ant-design/icons';
import { Menu, Avatar, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Sidebar = ({ selectedKey, onSelect, fullName }) => {
    const navigate = useNavigate();
    const { logout, role } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isEmployer = role === 'employer';
    const secondTabText = isEmployer ? 'Размещённые задания' : 'Решённые задания';
    const avatarIcon = isEmployer ? <BankOutlined style={{ fontSize: '32px' }} /> : <UserOutlined style={{ fontSize: '32px' }} />;

    return (
        <div className="h-screen w-80 flex flex-col shadow" style={{ backgroundColor: '#002040' }}>
            <div className="flex flex-col items-center px-6 py-6 text-white">
                <Avatar
                    size={64}
                    icon={avatarIcon}
                    style={{ backgroundColor: '#1890ff' }}
                />
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
                <Menu.Item key="info" style={{ color: 'white', fontSize: '16px', borderBottom: 'none' }}>
                    Основная информация
                </Menu.Item>
                <Menu.Item key="tasks" style={{ color: 'white', fontSize: '16px', borderBottom: 'none' }}>
                    {secondTabText}
                </Menu.Item>
            </Menu>

            <div className="p-4">
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
    );
};

export default Sidebar;
