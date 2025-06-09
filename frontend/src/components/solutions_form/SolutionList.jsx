import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SolutionCard from './SolutionCard';
import Pagination from '../tasks_form/Pagination';
import { FaInbox } from 'react-icons/fa';
import JSZip from 'jszip';

const SolutionList = ({ taskId }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [solutions, setSolutions] = useState([]);
  const [parsedFiles, setParsedFiles] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSolutions(currentPage);
  }, [taskId, currentPage]);

  const fetchSolutions = async (page) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/solutions/task_solutions/${taskId}`, {
        params: { limit: 1, page },
        withCredentials: true,
      });

      const solution = res.data.solutions?.[0];
      setSolutions(solution ? [solution] : []);
      setTotalPages(res.data.total_pages || 0);

      if (solution?.files?.length) {
        await fetchAndUnzipFiles(solution.files.map(f => f.file_path));
      } else {
        setParsedFiles([]);
      }
    } catch (error) {
      console.error('Ошибка при получении решений:', error);
    } finally {
      setLoading(false);
    }
  };

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
      console.error('Ошибка при распаковке архива:', error);
      setParsedFiles([]);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-screen bg-gray-800 text-white px-6 py-4 rounded-lg card-scroll overflow-y-auto w-full">
      <h3 className="text-3xl font-bold mb-6">Решения студентов</h3>

      {loading ? (
        <p className="text-gray-400">Загрузка...</p>
      ) : solutions.length > 0 ? (
        <>
          <SolutionCard
            solution={solutions[0]}
            files={parsedFiles}
          />
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center text-gray-500 mt-8">
          <FaInbox className="text-4xl mb-2" />
          <p>Решения пока не загружены</p>
        </div>
      )}
    </div>
  );
};

export default SolutionList;
