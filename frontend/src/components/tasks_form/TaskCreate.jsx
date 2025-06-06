import React, { useState, useCallback } from 'react';
import DropdownSelect from '../profile_form/DropdownSelect';
import { useDropzone } from 'react-dropzone';
import { FaRegFile, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 МБ
const MAX_FILES = 5;

const TaskCreate = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Легко');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      let rejectedFiles = [];

      if (files.length + acceptedFiles.length > MAX_FILES) {
        setError(`Максимум можно прикрепить ${MAX_FILES} файлов.`);
        setTimeout(() => setError(null), 5000);
        return;
      }

      const filteredFiles = acceptedFiles.filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          rejectedFiles.push(file.name);
          return false;
        }
        return true;
      });

      if (rejectedFiles.length > 0) {
        setError(`Файлы слишком большие (больше 20 МБ): ${rejectedFiles.join(', ')}`);
        setTimeout(() => setError(null), 5000);
      }

      setFiles((prevFiles) => [
        ...prevFiles,
        ...filteredFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })),
      ]);
    },
    [files]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleFileRemove = (fileName) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const convertDifficulty = (value) => {
    switch (value) {
      case 'Легко':
        return 'easy';
      case 'Нормально':
        return 'medium';
      case 'Сложно':
        return 'hard';
      default:
        return 'easy';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setShowModal(false);
    setLoading(true);

    try {
      const difficultyMapped = convertDifficulty(difficulty);

      // 1. Создание задания
      const taskResponse = await axios.post('http://127.0.0.1:8000/tasks/add', {
        title,
        description,
        difficulty: difficultyMapped,
      });

      const taskId = taskResponse.data.task_id;

      // 2. Если есть файлы — загружаем
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));

        await axios.post(`http://127.0.0.1:8000/files/upload_task_files/${taskId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      toast.success('Задание успешно создано!');
      setTitle('');
      setDescription('');
      setDifficulty('Легко');
      setFiles([]);
    } catch (err) {
      console.error(err);
      toast.error('Ошибка при создании задания.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="w-screen h-screen p-4 sm:p-8 overflow-y-auto card-scroll flex justify-center items-start bg-[#002040]">
        <div className="bg-gray-800 rounded-lg shadow-lg px-4 sm:px-8 py-8 w-full max-w-3xl box-border">
          <h1 className="text-3xl font-bold mb-6 text-white text-center">Создать новое задание</h1>

          <form onSubmit={handleSubmit} className="space-y-6 box-border">
            <div>
              <label htmlFor="title" className="block text-white font-semibold mb-2">
                Название
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="Введите название задания"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-white font-semibold mb-2">
                Описание
              </label>
              <textarea
                id="description"
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="Опишите задание"
                required
              />
            </div>

            <div className="mb-6">
              <DropdownSelect
                label="Сложность"
                value={difficulty}
                onChange={(value) => setDifficulty(value)}
                options={['Легко', 'Нормально', 'Сложно']}
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Прикрепить файлы</label>
              <div
                {...getRootProps()}
                className="w-full p-3 mt-2 bg-gray-700 border-dashed border-2 border-gray-500 text-white rounded-md cursor-pointer max-w-md"
              >
                <input {...getInputProps()} />
                <p >Перетащите файлы сюда или нажмите для выбора</p>
                <p className="text-xs mt-1 text-gray-400">Максимальный размер файла — 20 МБ.</p>
                <p className="text-xs text-gray-400">Можно прикрепить не более {MAX_FILES} файлов.</p>
              </div>
              {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
            </div>

            {files.length > 0 && (
              <div className="mt-4 max-w-md">
                <h3 className="text-lg text-white font-semibold mb-2" style={{ fontSize: '0.95rem' }}>
                  Выбранные файлы
                </h3>
                <ul className="space-y-2 text-left">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <FaRegFile className="text-white" />
                      <span className="text-white text-sm truncate max-w-xs">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleFileRemove(file.name)}
                        className="ml-auto text-red-500 hover:text-red-700 cursor-pointer"
                        title="Удалить файл"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition cursor-pointer"
                disabled={loading}
              >
                {loading ? 'Создание...' : 'Создать'}
              </button>
            </div>
          </form>
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>
            <div className="bg-gray-800 text-white rounded-md p-6 w-80 text-center shadow-2xl z-10">
              <h2 className="text-lg font-semibold mb-4">Создать тестовое задание?</h2>
              <div className="flex justify-between space-x-4">
                <button
                  onClick={handleConfirm}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition cursor-pointer"
                >
                  Создать
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition cursor-pointer"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Контейнер для уведомлений */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default TaskCreate;
