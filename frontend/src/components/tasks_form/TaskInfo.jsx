import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBriefcase, FaFileAlt, FaFilePdf, FaFileImage, FaFileExcel, FaDownload, FaEnvelope, FaPhone, FaTelegram, FaCopy, FaCheck } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import JSZip from 'jszip';

const TaskInfo = ({ task, taskFiles = [], isEmployer }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [logoError, setLogoError] = useState(false);
  const [contacts, setContacts] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [contactsError, setContactsError] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingFinish, setLoadingFinish] = useState(false);
  const navigate = useNavigate();

  const handleFinishClick = () => {
  setShowModal(true);
  };

  const handleConfirmFinish = async () => {
  setShowModal(false);
  setLoadingFinish(true);

  try {
      await axios.patch(`${API_URL}/tasks/update_status?task_id=${task.id}`);
      navigate('/employer/tasks');
    } catch (error) {
      console.error('Ошибка при завершении задания:', error);
    } finally {
      setLoadingFinish(false);
    }
  };

  const handleCancelFinish = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (task?.employer_name) {
      setLoadingContacts(true);
      axios.get(`${API_URL}/employers/employer_contacts`, {
        params: { company_name: task.employer_name }
      }).then(({ data }) => {
        setContacts(data);
        setContactsError(null);
      }).catch(() => {
        setContacts(null);
        setContactsError('Не удалось загрузить контакты');
      }).finally(() => {
        setLoadingContacts(false);
      });
    }
  }, [task?.employer_name]);

  const difficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Легко': return 'text-green-500';
      case 'Нормально': return 'text-orange-500';
      case 'Сложно': return 'text-red-500';
      default: return 'text-white';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'Легко';
      case 'medium': return 'Нормально';
      case 'hard': return 'Сложно';
      default: return 'Неизвестно';
    }
  };

  const getIconByExtension = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();

    switch (ext) {
      case 'pdf': return <FaFilePdf className="text-red-500 text-2xl" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
        return <FaFileImage className="text-blue-400 text-2xl" />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className="text-green-500 text-2xl" />;
      case 'doc':
      case 'docx':
      default:
        return <FaFileAlt className="text-white text-2xl" />;
    }
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();

    taskFiles.forEach(({ filename, content }) => {
      zip.file(filename, content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${task.title.replace(/\s+/g, '_')}_files.zip`);
  };

  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (err) {
      console.error('Ошибка при копировании:', err);
    }
  };

  const companyNameEncoded = encodeURIComponent(task.employer_name);
  const difficultyLabel = getDifficultyLabel(task.difficulty);

  return (
    <div
      className="bg-gray-800 p-6 rounded-lg card-scroll"
      style={{ height: '100%', overflowY: 'auto' }}
    >
      <div className="flex items-center mb-8">
        {!logoError ? (
          <img
            src={`${API_URL}/files/get_logo/${companyNameEncoded}`}
            alt={`${task.employer_name} логотип`}
            className="w-20 h-20 object-contain rounded mr-4"
            onError={() => setLogoError(true)}
          />
        ) : (
          <FaBriefcase className="text-white w-20 h-20 mr-4" style={{ fontSize: '80px' }} />
        )}
        <span className="text-3xl font-semibold text-white" style={{ fontSize: '1.5rem' }}>
          {task.employer_name}
        </span>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-3">Контактная информация</h3>

        {loadingContacts && <p className="text-gray-300">Загрузка...</p>}
        {contactsError && <p className="text-red-500">{contactsError}</p>}

        {contacts && (
          <div className="bg-gray-600 p-4 rounded-lg space-y-3 text-white text-sm">

            <div className="flex items-center justify-between">
              <div className="flex items-center break-words">
                <FaEnvelope className="mr-2 text-gray-400 shrink-0" />
                <span>{contacts.email}</span>
                <button
                  className="ml-2 text-white hover:text-gray-300 flex items-center"
                  onClick={() => handleCopy(contacts.email, 'email')}
                  title="Скопировать email"
                >
                  <FaCopy />
                  {copiedField === 'email' && <FaCheck className="ml-1 text-yellow-400" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaPhone className="mr-2 text-gray-400 shrink-0" />
                <span>{contacts.phone}</span>
                <button
                  className="ml-2 text-white hover:text-gray-300 flex items-center"
                  onClick={() => handleCopy(contacts.phone, 'phone')}
                  title="Скопировать телефон"
                >
                  <FaCopy />
                  {copiedField === 'phone' && <FaCheck className="ml-1 text-yellow-400" />}
                </button>
              </div>
            </div>

            {contacts.telegram && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaTelegram className="mr-2 text-gray-400 shrink-0" />
                  <span>{contacts.telegram}</span>
                  <button
                    className="ml-2 text-white hover:text-gray-300 flex items-center"
                    onClick={() => handleCopy(contacts.telegram, 'telegram')}
                    title="Скопировать Telegram"
                  >
                    <FaCopy />
                    {copiedField === 'telegram' && <FaCheck className="ml-1 text-yellow-400" />}
                  </button>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold text-white mb-4">Информация о задании</h2>
      <div className="border-b-2 border-gray-600 mb-10"></div>

      <div className="text-2xl font-bold text-white mb-6">{task.title}</div>

      <div className="mb-10 flex items-center">
        <h3 className="font-semibold text-lg mr-1">Сложность:</h3>
        <p className={`text-xl ml-1 ${difficultyColor(difficultyLabel)}`}>{difficultyLabel}</p>
      </div>

      <div className="mb-10">
        <h3 className="font-semibold text-lg text-white mb-3">Описание задания</h3>
        <p className="text-white whitespace-pre-line">{task.description}</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg text-white mb-4">Прикреплённые файлы</h3>

        {taskFiles.length > 0 ? (
          <>
            <ul className="space-y-4 mb-6">
              {taskFiles.map(({ filename, content }) => (
                <li key={filename} className="flex items-center gap-4 text-white">
                  {getIconByExtension(filename)}
                  <span>{filename}</span>
                  <button
                    className="ml-auto bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
                    onClick={() => saveAs(content, filename)}
                  >
                    Скачать
                  </button>
                </li>
              ))}
            </ul>

            <button
              className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-indigo-500 text-white py-2 px-4 rounded cursor-pointer"
              onClick={handleDownloadZip}
            >
              <FaDownload className="mr-2" />
              Скачать всё архивом
            </button>
          </>
        ) : (
          <p className="text-gray-300">Нет прикреплённых файлов</p>
        )}
      </div>

      {isEmployer && task.status === 'active' && (
        <div className="mt-10">
          <button
            className="w-full py-3 text-white rounded-md bg-amber-800 hover:bg-red-700 transition-colors cursor-pointer"
            onClick={handleFinishClick}
          >
            Завершить задание
          </button>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>
          <div className="bg-gray-800 text-white rounded-md p-6 w-80 text-center shadow-2xl z-10">
            <h2 className="text-lg font-semibold mb-4">Вы уверены, что хотите завершить задание?</h2>
            <p className="text-sm text-gray-300 mb-4">Студенты больше не смогут отправлять свои решения</p>
            <p className="text-sm text-gray-300 mb-6">Это действие необратимо</p>
            <div className="flex justify-between space-x-4">
              <button
                onClick={handleConfirmFinish}
                className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition cursor-pointer"
              >
                Подтвердить
              </button>
              <button
                onClick={handleCancelFinish}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition cursor-pointer"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskInfo;
