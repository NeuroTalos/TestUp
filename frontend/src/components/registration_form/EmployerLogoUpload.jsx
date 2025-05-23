import React, { useState, useEffect } from 'react';
import { Upload, Button, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const EmployerLogoUpload = ({ onFileSelect }) => {
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);

  const MAX_SIZE = 200 * 1024; // 200 КБ

  // Автоматически скрываем ошибку через 10 секунд
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000); // 10000 мс = 10 секунд

      return () => clearTimeout(timer); // очистка таймера при смене ошибки или размонтировании
    }
  }, [error]);

  const beforeUpload = (file) => {
    if (file.size > MAX_SIZE) {
      setError('Размер файла превышает 200 КБ. Пожалуйста, выберите файл меньшего размера.');
      setFileName(null);
      onFileSelect(null);
      return Upload.LIST_IGNORE;
    }
    setError(null);
    return true;
  };

  const handleChange = ({ file }) => {
    if (file.status === 'removed') {
      setFileName(null);
      setError(null);
      onFileSelect(null);
    } else if (file.originFileObj) {
      if (file.originFileObj.size <= MAX_SIZE) {
        setFileName(file.name);
        setError(null);
        onFileSelect(file.originFileObj);
      } else {
        setFileName(null);
        setError('Размер файла превышает 200 КБ. Пожалуйста, выберите файл меньшего размера.');
        onFileSelect(null);
      }
    }
  };

  return (
    <div style={{ marginTop: 14, marginBottom: 16, position: 'relative' }}>
      <Typography.Text
        className='font-bold'
        style={{ color: 'white', display: 'block', marginBottom: 8 }}
      >
        Логотип компании (опционально)
      </Typography.Text>
      <Upload
        beforeUpload={beforeUpload}
        customRequest={({ file, onSuccess }) => {
          setTimeout(() => {
            onSuccess("ok");
          }, 0);
        }}
        onChange={handleChange}
        maxCount={1}
        accept="image/*"
        showUploadList={{ showRemoveIcon: true, showPreviewIcon: false }}
      >
        <Typography.Text
          type="secondary"
          style={{ fontSize: 12, display: 'block', marginBottom: 8, color: '#888888' }}
        >
          Максимальный размер файла: 200 КБ
        </Typography.Text>
        <Button
          icon={<UploadOutlined />}
          style={{
            backgroundColor: '#283144',
            color: 'white',
            borderColor: '#283144',
            width: '100%',
            textAlign: 'center',
            marginTop: 4,
          }}
        >
          Выбрать файл
        </Button>
      </Upload>
      {fileName && (
        <Typography.Text style={{ color: '#a0aec0', marginTop: 8, display: 'block' }}>
          Выбран файл: {fileName}
        </Typography.Text>
      )}

      {error && (
        <div
          style={{
            marginTop: 12,
            padding: '10px 15px',
            backgroundColor: '#ff4d4f',
            color: 'white',
            borderRadius: 6,
            boxShadow: '0 2px 8px rgba(255, 77, 79, 0.3)',
            fontWeight: '600',
            fontSize: 14,
            animation: 'fadeIn 0.3s ease forwards',
          }}
        >
          {error}
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default EmployerLogoUpload;
