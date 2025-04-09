import React from 'react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input } from 'antd';

const PasswordInput = ( {onChange} ) => {
  
  return (
    <div className="mb-3">
      <Input.Password
        size="large"
        placeholder="Пароль"
        onChange={onChange}
        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
      />
    </div>
  )
};

export default PasswordInput;
