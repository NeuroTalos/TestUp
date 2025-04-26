import React from 'react';
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const PasswordInput = ({ label = 'Пароль', value, onChange }) => {
  return (
    <div className="w-full">
      <label className="block text-white font-bold mb-2 ml-1">
        {label}
      </label>
      <Input.Password
        value={value}
        maxLength={20}
        onChange={onChange}
        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #283144',
          color: 'white',
        }}
      />
    </div>
  );
};

export default PasswordInput;
