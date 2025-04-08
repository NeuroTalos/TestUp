import React from 'react';
import { Card, Space } from 'antd';
import TextInput from './text_input';
import PasswordInput from './password_input';
import GenderChoice from './gender_choice';
import StudyInfoInput from './study_info_choice';

const RegistrationWidget = () => (
  <div className="w-screen h-screen grid place-content-center">
    <Space direction="vertical" size={16}>
      <Card 
        title={<div style={{ textAlign: "center", fontWeight: "bold", fontSize: 24 }}>Регистрация</div>}
        style={{ 
          width: 600, 
          maxHeight: '80vh',
        }}
        className="border-2 border-black rounded-lg overflow-y-auto"
        >
          <TextInput
            placeholder={"Логин"}
            maxLength={40}
          />

          <PasswordInput/>

          <TextInput
            placeholder={"Имя"}
            maxLength={100}
          />

          <TextInput
            placeholder={"Фамилия"}
            maxLength={100}
          />

          <TextInput
            placeholder={"Отчество (опционально)"}
            maxLength={100}
          />

          <TextInput
            placeholder={"Дата рождения (ДД.ММ.ГГГГ)"}
            maxLength={10}
          />

          <TextInput
            placeholder={"Электронная почта"}
            maxLength={100}
          />

          <TextInput
            placeholder={"Телефон"}
            maxLength={11}
          />

          <GenderChoice/>

          <StudyInfoInput/>


      </Card>
    </Space>
  </div>
);
export default RegistrationWidget;