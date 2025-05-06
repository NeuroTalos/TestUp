import React from 'react';

const ReadOnlyField = ({ label, value }) => {
    return (
        <div className="w-full mt-3">
            <label className="block text-white font-bold mb-1 ml-1">
                {label}
            </label>
            <div
                className="px-1 py-1 rounded"
                style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    minHeight: '32px',
                    lineHeight: '1.5',
                    cursor: 'default'
                }}
            >
                {value || '-'}
            </div>
        </div>
    );
};

export default ReadOnlyField;