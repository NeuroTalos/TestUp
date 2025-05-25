import React from 'react';
import { FaDownload, FaEnvelope, FaPhone, FaTelegram, FaCopy } from 'react-icons/fa';
import { saveAs } from 'file-saver';

const SolutionCard = ({ solution, files = [] }) => {
  const { student = {} } = solution;

  const handleDownloadZip = () => {
    const zipBlob = new Blob(files.map(f => f.content), { type: 'application/zip' });
    saveAs(zipBlob, 'solution_files.zip');
  };

  const downloadSingleFile = (file) => {
    saveAs(file.content, file.filename);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // alert убран, ничего не показываем
    } catch (err) {
      // Ошибку тоже не показываем, можно оставить пусто или лог в консоль
      console.error('Ошибка при копировании:', err);
    }
  };

  return (
    <div className="w-full bg-gray-800 px-4 py-6">
      <div className="max-w-3xl mx-auto bg-gray-700 p-6 rounded-xl shadow-xl w-full flex flex-col space-y-6">

        {/* Имя */}
        <h4 className="text-2xl font-semibold text-white break-words">
          {student.last_name} {student.first_name} {student.middle_name || ''}
        </h4>

        {/* Контактные данные */}
        <div>
          <h5 className="text-white font-semibold mb-2">Контактная информация</h5>
          <div className="bg-gray-600 p-4 rounded-lg space-y-3 text-sm">
            <div className="flex items-center text-white break-words">
              <FaEnvelope className="mr-2 text-gray-400 shrink-0" />
              <span>{student.email}</span>
              <button
                className="ml-2 text-white hover:text-gray-300"
                onClick={() => handleCopy(student.email)}
                title="Скопировать email"
              >
                <FaCopy />
              </button>
            </div>

            <div className="flex items-center text-white">
              <FaPhone className="mr-2 text-gray-400 shrink-0" />
              <span>{student.phone}</span>
              <button
                className="ml-2 text-white hover:text-gray-300"
                onClick={() => handleCopy(student.phone)}
                title="Скопировать телефон"
              >
                <FaCopy />
              </button>
            </div>

            {student.telegram && (
              <div className="flex items-center text-white">
                <FaTelegram className="mr-2 text-gray-400 shrink-0" />
                <span>{student.telegram}</span>
                <button
                  className="ml-2 text-white hover:text-gray-300"
                  onClick={() => handleCopy(student.telegram)}
                  title="Скопировать Telegram"
                >
                  <FaCopy />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Учебная информация */}
        <div>
          <h5 className="text-white font-semibold mb-2">Учебная информация</h5>
          <div className="text-gray-400 text-sm space-y-1">
            <p>Курс: <span className="text-white">{student.course}</span></p>
            <p>Группа: <span className="text-white">{student.group}</span></p>
            <p>Факультет: <span className="text-white">{student.faculty_name}</span></p>
            <p>Направление: <span className="text-white">{student.major_name}</span></p>
          </div>
        </div>

        {/* Описание решения */}
        {solution.solution_description && (
          <div>
            <h5 className="text-white font-semibold mb-2">Описание решения</h5>
            <div className="text-gray-200 text-base border-t border-gray-600 whitespace-pre-line">
              {solution.solution_description}
            </div>
          </div>
        )}

        {/* Прикреплённые файлы */}
        <div>
          <h5 className="text-white font-semibold mb-3">Прикреплённые файлы:</h5>
          {files.length > 0 ? (
            <>
              <ul className="space-y-3 mb-4">
                {files.map((file, i) => (
                  <li key={i} className="flex flex-wrap sm:flex-nowrap justify-between items-center text-white gap-2">
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

              <div className="w-full">
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
            <p className="text-gray-400 italic">Файлы отсутствуют</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolutionCard;
