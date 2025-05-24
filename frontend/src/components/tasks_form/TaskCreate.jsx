import React, { useState, useCallback } from 'react';
import DropdownSelect from '../profile_form/DropdownSelect';
import { useDropzone } from 'react-dropzone';
import { FaRegFile, FaTrash } from 'react-icons/fa';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 МБ

const TaskCreate = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Легко');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    let rejectedFiles = [];

    const filteredFiles = acceptedFiles.filter(file => {
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

    setFiles(prevFiles => [
      ...prevFiles,
      ...filteredFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) })),
    ]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleFileRemove = (fileName) => {
    setFiles(prev => prev.filter(file => file.name !== fileName));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, description, difficulty, files });
  };

  return (
    <div className="w-screen h-screen p-4 sm:p-8 overflow-y-auto card-scroll flex justify-center items-start bg-[#002040]">
      <div className="bg-gray-800 rounded-lg shadow-lg px-4 sm:px-8 py-8 w-full max-w-3xl box-border">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">Создать новое задание</h1>

        <form onSubmit={handleSubmit} className="space-y-6 box-border">

          <div>
            <label htmlFor="title" className="block text-white font-semibold mb-2">Название</label>
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
            <label htmlFor="description" className="block text-white font-semibold mb-2">Описание</label>
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
              style={{ fontSize: '0.9rem', textAlign: 'left' }}
              title="Перетащите файлы сюда или кликните для выбора"
            >
              <input {...getInputProps()} />
              <p>Перетащите файлы сюда или нажмите для выбора</p>
              <p className="text-xs mt-1 text-gray-400">Максимальный размер файла — 20 МБ</p>
            </div>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          </div>

          {files.length > 0 && (
            <div className="mt-4 max-w-md">
              <h3 className="text-lg text-white font-semibold mb-2" style={{ fontSize: '0.95rem'}}>Выбранные файлы</h3>
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
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
            >
              Создать
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TaskCreate;
