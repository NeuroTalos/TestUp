import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaRegFile, FaTimes } from 'react-icons/fa';

const TaskStudentSolutionForm = ({ handleSubmit }) => {
    const [files, setFiles] = useState([]);
    
    const onDrop = useCallback((acceptedFiles) => {
        setFiles((prevFiles) => [
            ...prevFiles,
            ...acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })),
        ]);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: true,
        accept: '.pdf,.jpg,.jpeg,.png,.txt,.docx,.xlsx',
    });

    const handleFileRemove = (fileName) => {
        setFiles(files.filter((file) => file.name !== fileName));
    };

    return (
        <div className="flex-grow bg-gray-800 p-6 rounded-lg overflow-y-auto card-scroll" style={{ flexBasis: '65%' }}>
            <h2 className="text-3xl font-bold mb-4 text-white">Предоставьте своё решение</h2>
            <div className="border-b-2 border-gray-600 mb-10"></div>
            <form onSubmit={handleSubmit}>
                <div className="mb-10">
                    <label htmlFor="description" className="text-2xl font-semibold text-white">Описание решения</label>
                    <textarea
                        id="description"
                        rows="6"
                        className="w-full p-3 mt-5 bg-gray-700 text-white rounded-md border-none"
                        placeholder="Опишите ваше решение..."
                    />
                </div>

                <div className="mb-10">
                    <label className="font-semibold text-white">Прикрепить файлы с решением</label>
                    <div
                        {...getRootProps()}
                        className="w-full p-6 mt-4 bg-gray-700 border-dashed border-2 border-gray-500 text-white rounded-md text-center"
                    >
                        <input {...getInputProps()} />
                        <p className="text-lg">Перетащите файлы сюда или нажмите для выбора</p>
                    </div>
                </div>

                {files.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Выбранные файлы</h3>
                        <ul className="space-y-4">
                            {files.map((file, index) => (
                                <li key={index} className="flex items-center space-x-3">
                                    <FaRegFile className="text-white" />
                                    <span className="text-white">{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleFileRemove(file.name)}
                                        className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                                    >
                                        <FaTimes />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    type="submit"
                    className="mt-8 w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                >
                    Отправить решение
                </button>
            </form>
        </div>
    );
};

export default TaskStudentSolutionForm;
