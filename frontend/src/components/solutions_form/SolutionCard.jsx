import React, { useState } from 'react';
import { FaDownload, FaEnvelope, FaPhone, FaTelegram, FaCopy, FaCheck } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import axios from 'axios';

const SolutionCard = ({ solution, files = [] }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { student = {} } = solution;
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);

  const [copiedField, setCopiedField] = useState(null);
  const [commentError, setCommentError] = useState(null);

  const handleDownloadZip = () => {
    const zipBlob = new Blob(files.map(f => f.content), { type: 'application/zip' });
    saveAs(zipBlob, 'solution_files.zip');
  };

  const downloadSingleFile = (file) => {
    saveAs(file.content, file.filename);
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

  const handleAddCommentClick = () => {
    setCommentText('');
    setCommentError(null);
    setShowCommentModal(true);
  };

  const handleCancelComment = () => {
    setShowCommentModal(false);
    setCommentError(null);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      setCommentError('Комментарий не может быть пустым.');
      return;
    }

    setCommentError(null);
    setLoadingComment(true);

    try {
      await axios.patch(`${API_URL}/solutions/upload_solution_comment/${solution.id}`, null, {
        params: { employer_comment: commentText.trim() }
      });

      setShowCommentModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
    } finally {
      setLoadingComment(false);
    }
  };

  return (
    <div className="w-full bg-gray-800 px-4 py-6">
      <div className="max-w-lg sm:max-w-3xl mx-auto bg-gray-700 p-4 sm:p-6 rounded-xl shadow-xl flex flex-col space-y-6">

        {/* Имя */}
        <h4 className="text-xl sm:text-2xl font-semibold text-white break-words">
          {student.last_name} {student.first_name} {student.middle_name || ''}
        </h4>

        {/* Дата отправки */}
        {solution.created_at && (
          <p className="text-white text-xs sm:text-sm">
            Дата отправки: {new Date(solution.created_at).toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </p>
        )}

        {/* Контактная информация */}
        <div>
          <h5 className="text-white font-semibold mb-2 text-sm sm:text-base">Контактная информация</h5>
          <div className="bg-gray-600 p-3 sm:p-4 rounded-lg space-y-3 text-xs sm:text-sm">

            {/* Email */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-white break-words">
              <div className="flex items-center mb-1 sm:mb-0 max-w-full sm:max-w-[70%] truncate">
                <FaEnvelope className="mr-2 text-gray-400 shrink-0" />
                <span className="truncate">{student.email}</span>
              </div>
              <button
                className="ml-0 sm:ml-2 mt-1 sm:mt-0 text-white hover:text-gray-300 flex items-center shrink-0"
                onClick={() => handleCopy(student.email, 'email')}
                title="Скопировать email"
              >
                <FaCopy />
                {copiedField === 'email' && <FaCheck className="ml-1 text-yellow-400" />}
              </button>
            </div>

            {/* Телефон */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-white break-words">
              <div className="flex items-center mb-1 sm:mb-0 max-w-full sm:max-w-[70%] truncate">
                <FaPhone className="mr-2 text-gray-400 shrink-0" />
                <span className="truncate">{student.phone}</span>
              </div>
              <button
                className="ml-0 sm:ml-2 mt-1 sm:mt-0 text-white hover:text-gray-300 flex items-center shrink-0"
                onClick={() => handleCopy(student.phone, 'phone')}
                title="Скопировать телефон"
              >
                <FaCopy />
                {copiedField === 'phone' && <FaCheck className="ml-1 text-yellow-400" />}
              </button>
            </div>

            {/* Telegram */}
            {student.telegram && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-white break-words">
                <div className="flex items-center mb-1 sm:mb-0 max-w-full sm:max-w-[70%] truncate">
                  <FaTelegram className="mr-2 text-gray-400 shrink-0" />
                  <span className="truncate">{student.telegram}</span>
                </div>
                <button
                  className="ml-0 sm:ml-2 mt-1 sm:mt-0 text-white hover:text-gray-300 flex items-center shrink-0"
                  onClick={() => handleCopy(student.telegram, 'telegram')}
                  title="Скопировать Telegram"
                >
                  <FaCopy />
                  {copiedField === 'telegram' && <FaCheck className="ml-1 text-yellow-400" />}
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Учебная информация */}
        <div>
          <h5 className="text-white font-semibold mb-2 text-sm sm:text-base">Учебная информация</h5>
          <div className="text-gray-400 text-xs sm:text-sm space-y-1">
            <p>Курс: <span className="text-white">{student.course}</span></p>
            <p>Группа: <span className="text-white">{student.group}</span></p>
            <p>Факультет: <span className="text-white">{student.faculty_name}</span></p>
            <p>Направление: <span className="text-white">{student.major_name}</span></p>
          </div>
        </div>

        {/* Описание решения */}
        {solution.solution_description && (
          <div>
            <h5 className="text-white font-semibold mb-2 text-sm sm:text-base">Описание решения</h5>
            <div className="text-gray-200 text-xs sm:text-base border-t border-gray-600 whitespace-pre-line">
              {solution.solution_description}
            </div>
          </div>
        )}

        {/* Файлы */}
        <div>
          <h5 className="text-white font-semibold mb-3 text-sm sm:text-base">Прикреплённые файлы</h5>
          {files.length > 0 ? (
            <>
              <ul className="space-y-3 mb-4">
                {files.map((file, i) => (
                  <li
                    key={i}
                    className="flex flex-wrap sm:flex-nowrap justify-between items-center text-white gap-2"
                  >
                    <span className="truncate max-w-full sm:max-w-[70%]">{file.filename}</span>
                    <button
                      className="flex-shrink-0 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      onClick={() => downloadSingleFile(file)}
                    >
                      Скачать
                    </button>
                  </li>
                ))}
              </ul>

              <div className="w-full mb-6">
                <button
                  className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-indigo-500 text-white py-2 px-4 rounded"
                  onClick={handleDownloadZip}
                >
                  <FaDownload className="mr-2" />
                  Скачать всё архивом
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-400 italic text-xs sm:text-sm">Файлы отсутствуют</p>
          )}
        </div>

        {/* Комментарий */}
        <div>
          {solution.employer_comment ? (
            <>
              <h5 className="text-white font-semibold text-sm sm:text-base">Комментарий</h5>
              <div className="border-t border-gray-600 mt-2" />
              <p className="text-gray-300 whitespace-pre-line mt-2 text-xs sm:text-sm">{solution.employer_comment}</p>
            </>
          ) : (
            <button
              onClick={handleAddCommentClick}
              className="bg-blue-600 hover:bg-indigo-500 text-white px-4 py-2 mt-4 rounded transition text-sm sm:text-base"
            >
              Добавить комментарий
            </button>
          )}
        </div>
      </div>

      {/* Модальное окно */}
      {showCommentModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="bg-gray-800 text-white rounded-md p-4 sm:p-6 w-full max-w-md z-10 shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Добавить комментарий</h2>
            <textarea
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
                if (commentError && e.target.value.trim() !== '') {
                  setCommentError(null);
                }
              }}
              rows={5}
              className={`w-full p-2 rounded-md bg-gray-700 border ${
                commentError ? 'border-red-500' : 'border-gray-600'
              } focus:outline-none focus:border-blue-500 text-white resize-none text-sm sm:text-base`}
              placeholder="Введите комментарий"
            />
            {commentError && (
              <p className="mt-1 text-red-500 text-sm">{commentError}</p>
            )}
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={handleCancelComment}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition text-sm sm:text-base"
                disabled={loadingComment}
              >
                Отмена
              </button>
              <button
                onClick={handleSubmitComment}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition text-sm sm:text-base"
                disabled={loadingComment}
              >
                {loadingComment ? 'Отправка...' : 'Отправить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionCard;
