import React from 'react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';

const PasswordInput = ( {placeholder} ) => {
  
  return (
    <div className="mb-3">
      <Input.Password
        size="large"
        placeholder="Пароль"
        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
      />
    </div>
  )
};

export default PasswordInput;
