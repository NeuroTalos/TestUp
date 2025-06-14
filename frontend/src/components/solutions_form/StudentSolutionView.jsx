import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FaDownload, FaFileAlt, FaFilePdf, FaFileImage, FaFileExcel } from 'react-icons/fa';

const StudentSolutionView = ({ solution }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [parsedFiles, setParsedFiles] = useState([]);

  useEffect(() => {
    if (solution?.files?.length) {
      fetchAndUnzipFiles(solution.files.map(f => f.file_path));
    }
  }, [solution]);

  const fetchAndUnzipFiles = async (filePaths) => {
    try {
      const res = await axios.post(
        `${API_URL}/files/get_solution_files/`,
        filePaths,
        {
          responseType: 'blob',
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const zip = await JSZip.loadAsync(res.data);
      const extractedFiles = [];

      await Promise.all(
        Object.entries(zip.files).map(async ([filename, file]) => {
          if (!file.dir) {
            const content = await file.async('blob');
            extractedFiles.push({ filename, content });
          }
        })
      );

      setParsedFiles(extractedFiles);
    } catch (error) {
      console.error('Ошибка при загрузке файлов:', error);
      setParsedFiles([]);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return 'Неизвестно';
    const date = new Date(iso);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getIconByExtension = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return <FaFilePdf className="text-red-500 text-xl" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
        return <FaFileImage className="text-blue-400 text-xl" />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className="text-green-500 text-xl" />;
      default:
        return <FaFileAlt className="text-white text-xl" />;
    }
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    parsedFiles.forEach(file => {
      zip.file(file.filename, file.content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'solution_files.zip');
  };

  const downloadSingleFile = (file) => {
    saveAs(file.content, file.filename);
  };

  return (
    <div className="flex flex-col h-full max-h-screen bg-gray-800 text-white px-4 py-4 rounded-lg overflow-y-auto w-full card-scroll">
      <div className="max-w-3xl mx-auto bg-gray-700 p-6 rounded-xl shadow-xl w-full flex flex-col space-y-6">

        <h2 className="text-2xl font-bold text-white">Вы уже отправили решение</h2>

        {/* Дата */}
        <div className="text-gray-300 text-sm">
          <span className="font-semibold text-white">Дата отправки:</span> {formatDate(solution.created_at)}
        </div>

        {/* Описание */}
        {solution.solution_description && (
          <div>
            <h3 className="text-white font-semibold mb-2">Описание решения</h3>
            <p className="text-gray-200 whitespace-pre-line border-t border-gray-600 pt-2">{solution.solution_description}</p>
          </div>
        )}

        {/* Файлы */}
        <div>
          <h3 className="text-white font-semibold mb-3">Прикреплённые файлы</h3>
          {parsedFiles.length > 0 ? (
            <>
              <ul className="space-y-3 mb-4">
                {parsedFiles.map((file, i) => (
                  <li
                    key={i}
                    className="flex flex-wrap sm:flex-nowrap justify-between items-center text-white gap-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {getIconByExtension(file.filename)}
                      <span className="truncate max-w-[60vw] sm:max-w-[400px]">{file.filename}</span>
                    </div>
                    <button
                      onClick={() => downloadSingleFile(file)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm mt-2 sm:mt-0"
                    >
                      Скачать
                    </button>
                  </li>
                ))}
              </ul>

              <div className="w-full">
                <button
                  onClick={handleDownloadAll}
                  className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-indigo-500 text-white py-2 px-4 rounded"
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

        {/* Комментарий работодателя */}
        <div>
          <h3 className="text-white font-semibold mb-2">Комментарий работодателя</h3>
          {solution.employer_comment ? (
            <p className="text-gray-300 whitespace-pre-line border-t border-gray-600 pt-2">{solution.employer_comment}</p>
          ) : (
            <p className="text-gray-400 italic border-t border-gray-600 pt-2">Работодатель не предоставил свой комментарий</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentSolutionView;
