import React, { useState } from 'react';
import { FaBriefcase, FaFileAlt, FaFilePdf, FaFileImage, FaFileExcel, FaDownload } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

const TaskInfo = ({ task, taskFiles = [], isEmployer }) => {
    const [logoError, setLogoError] = useState(false);

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

    const difficultyLabel = getDifficultyLabel(task.difficulty);
    const companyNameEncoded = encodeURIComponent(task.employer_name);

    const handleDownloadZip = async () => {
        const zip = new JSZip();

        taskFiles.forEach(({ filename, content }) => {
            zip.file(filename, content);
        });

        const blob = await zip.generateAsync({ type: 'blob' });
        saveAs(blob, `${task.title.replace(/\s+/g, '_')}_files.zip`);
    };

    return (
        <div className="flex-shrink-0 bg-gray-800 p-6 rounded-lg overflow-y-auto card-scroll" style={{ flexBasis: '40%' }}>
            <h2 className="text-3xl font-bold text-white mb-4">Информация о задаче</h2>
            <div className="border-b-2 border-gray-600 mb-10"></div>

            <div className="flex items-center mb-6">
                {!logoError ? (
                    <img
                        src={`http://127.0.0.1:8000/files/get_logo/${companyNameEncoded}`}
                        alt={`${task.employer_name} логотип`}
                        className="w-20 h-20 object-contain rounded mr-4"
                        onError={() => setLogoError(true)}
                    />
                ) : (
                    <FaBriefcase className="text-white w-20 h-20 mr-4" style={{ fontSize: '80px' }} />
                )}
                <span className="text-3xl font-semibold text-lg text-white" style={{ fontSize: '1.5rem' }}>
                    {task.employer_name}
                </span>
            </div>

            <div className="text-2xl font-bold text-white mb-6">{task.title}</div>

            <div className="mb-10 flex items-center">
                <h3 className="font-semibold text-lg mr-1">Сложность:</h3>
                <p className={`text-xl ml-1 ${difficultyColor(difficultyLabel)}`}>{difficultyLabel}</p>
            </div>

            <div className="mb-10">
                <h3 className="font-semibold text-lg text-white mb-3">Описание задачи:</h3>
                <p className="text-white">{task.description}</p>
            </div>

            <div>
                <h3 className="font-semibold text-lg text-white mb-4">Прикреплённые файлы:</h3>

                {taskFiles.length > 0 ? (
                    <>
                        <ul className="space-y-4 mb-6">
                            {taskFiles.map(({ filename, content }) => (
                                <li key={filename} className="flex items-center gap-4 text-white">
                                    {getIconByExtension(filename)}
                                    <span>{filename}</span>
                                    <button
                                        className="ml-auto bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded"
                                        onClick={() => saveAs(content, filename)}
                                    >
                                        Скачать
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <button
                            className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-indigo-500 text-white py-2 px-4 rounded"
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

            {isEmployer && (
                <div className="mt-20">
                    <button
                        className="w-full py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-500"
                        onClick={(e) => e.preventDefault()}
                    >
                        Редактировать задачу
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskInfo;
