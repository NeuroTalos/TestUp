import React, { useState, useEffect } from 'react';
import { Upload, Button, Typography } from 'antd';
import { UploadOutlined, PaperClipOutlined, DeleteOutlined } from '@ant-design/icons';

const EmployerLogoUpload = ({ onFileSelect }) => {
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);
  const [fileList, setFileList] = useState([]);

  const MAX_SIZE = 200 * 1024; // 200 КБ

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000);
      return () => clearTimeout(timer);
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

  const handleChange = ({ file, fileList }) => {
    // Фильтруем только валидные по размеру файлы
    const filteredList = fileList.filter(item => item.originFileObj && item.originFileObj.size <= MAX_SIZE);

    if (file.status === 'removed') {
      setFileList([]);
      setFileName(null);
      setError(null);
      onFileSelect(null);
    } else if (file.originFileObj && file.originFileObj.size > MAX_SIZE) {
      // Ошибка, не добавляем в список
      setError('Размер файла превышает 200 КБ. Пожалуйста, выберите файл меньшего размера.');
      setFileName(null);
      onFileSelect(null);
      // Не обновляем fileList, чтобы файл не отображался
    } else {
      setFileList(filteredList);
      if (filteredList.length > 0) {
        const lastFile = filteredList[filteredList.length - 1];
        lastFile.status = 'done'; // убираем спиннер
        setFileName(lastFile.name);
        setError(null);
        onFileSelect(lastFile.originFileObj);
      } else {
        setFileName(null);
        onFileSelect(null);
      }
    }
  };

  return (
    <div style={{ marginTop: 14, marginBottom: 16, position: 'relative' }}>
      <Typography.Text
        className="font-bold"
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
        fileList={fileList}
        maxCount={1}
        accept="image/*"
        showUploadList={{
          showRemoveIcon: true,
          showPreviewIcon: false,
          removeIcon: (
            <DeleteOutlined
              style={{ color: 'red', fontSize: 16 }}
              onClick={e => e.stopPropagation()}
            />
          ),
          iconRender: () => (
            <PaperClipOutlined style={{ fontSize: 18, color: 'rgba(0,0,0,0.45)' }} />
          ),
        }}
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
