import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FaRegFile, FaTrash } from 'react-icons/fa';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 МБ
const MAX_FILES = 5;

const TaskStudentSolutionForm = ({ taskId }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    accept: '.pdf,.jpg,.jpeg,.png,.txt,.docx,.xlsx',
  });

  const handleFileRemove = (fileName) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  // При сабмите показываем модальное окно
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  // Подтверждение отправки
  const handleConfirm = async () => {
    setShowModal(false);
    setLoading(true);
    setError(null);

    const description = document.getElementById('description').value;

    try {
      // Отправляем описание решения
      const response = await axios.post(`http://127.0.0.1:8000/solutions/add/${taskId}`, {
        solution_description: description,
      });

      if (!response.data.ok) {
        throw new Error('Ошибка при сохранении решения');
      }

      const solution_id = response.data.solution_id;

      // Отправляем файлы, если есть
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('files', file);
        });

        await axios.post(`http://127.0.0.1:8000/files/upload_solution_files/${solution_id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      // Обновляем страницу через 1 секунду
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Ошибка при отправке');
      setLoading(false);
    }
  };

  // Отмена отправки
  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="flex-grow bg-gray-800 p-6 rounded-lg overflow-y-auto card-scroll" style={{ flexBasis: '65%' }}>
        <h2 className="text-3xl font-bold mb-4 text-white">Предоставьте своё решение</h2>
        <div className="border-b-2 border-gray-600 mb-10"></div>
        <form onSubmit={handleSubmit}>
          <div className="mb-10">
            <label htmlFor="description" className="text-2xl font-semibold text-white">
              Описание решения
            </label>
            <textarea
              id="description"
              name="description"
              rows="6"
              className="w-full p-3 mt-5 bg-gray-700 text-white rounded-md border-none"
              placeholder="Опишите ваше решение..."
              required
              disabled={loading}
            />
          </div>

          <div className="mb-10">
            <label className="font-semibold text-white">Прикрепить файлы с решением</label>
            <div
              {...getRootProps()}
              className={`w-full p-3 mt-4 bg-gray-700 border-dashed border-2 border-gray-500 text-white rounded-md cursor-pointer max-w-md text-left ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <input {...getInputProps()} disabled={loading} />
              <p>Перетащите файлы сюда или нажмите для выбора</p>
              <p className="text-xs mt-1 text-gray-400">Максимальный размер файла — 20 МБ.</p>
              <p className="text-xs text-gray-400">Можно прикрепить не более {MAX_FILES} файлов.</p>
            </div>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          </div>

          {files.length > 0 && (
            <div className="mb-6 max-w-md">
              <h3 className="text-xl font-semibold text-white mb-4">Выбранные файлы</h3>
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
                      disabled={loading}
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? 'Отправка...' : 'Отправить решение'}
          </button>
        </form>
      </div>

      {/* Модальное окно подтверждения */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>
          <div className="bg-gray-800 text-white rounded-md p-6 w-80 text-center shadow-2xl z-10">
            <h2 className="text-lg font-semibold mb-4">Подтвердите отправку решения</h2>
            <p className="mb-2">Вы уверены, что хотите отправить своё решение?</p>
            <p className="mb-6">После отправки, изменить решение будет нельзя.</p>
            <div className="flex justify-between space-x-4">
              <button
                onClick={handleConfirm}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
              >
                Отправить
              </button>
              <button
                onClick={handleCancel}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskStudentSolutionForm;
