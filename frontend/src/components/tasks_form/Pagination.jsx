import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        pageNumbers.push(1);
        if (currentPage > 4) pageNumbers.push('...');
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pageNumbers.push(i);
        }
        if (currentPage < totalPages - 3) pageNumbers.push('...');
        pageNumbers.push(totalPages);
    }

    return (
        <div className="flex justify-center mt-8 mb-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 text-white bg-[#003c5f] rounded disabled:opacity-40 hover:bg-blue-600"
            >
                Назад
            </button>

            {pageNumbers.map((page, index) =>
                page === '...' ? (
                    <span key={index} className="px-2 py-1 mx-1 text-white">...</span>
                ) : (
                    <button
                        key={index}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 mx-1 rounded ${
                            currentPage === page
                                ? 'bg-blue-600 text-white font-bold'
                                : 'bg-gray-400 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 text-white bg-[#003c5f] rounded disabled:opacity-40 hover:bg-blue-600"
            >
                Вперёд
            </button>
        </div>
    );
};

export default Pagination;
