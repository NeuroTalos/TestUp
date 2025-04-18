import React from 'react';
import { Select } from 'antd';

const DropdownSelect = ({ label, options, value, onChange }) => {
    return (
        <div className="w-full">
            <label className="block text-white font-bold mb-1">
                {label}
            </label>
            <Select
                value={value}
                onChange={onChange}
                className="w-full custom-dark-select"
                dropdownStyle={{
                    backgroundColor: '#343F4D',
                    color: 'white',
                }}
            >
                {options.map((option, index) => (
                    <Select.Option
                        key={index}
                        value={option}
                        style={{
                            backgroundColor: '#343F4D',
                            color: 'white',
                        }}
                    >
                        {option}
                    </Select.Option>
                ))}
            </Select>

            <style>
                {`
                .custom-dark-select .ant-select-selector {
                    background-color: #343F4D !important;
                    color: white !important;
                    border: 1px solid #283144 !important;
                    border-radius: 4px;
                }
                .custom-dark-select .ant-select-selection-item {
                    color: white !important;
                }
                .custom-dark-select .ant-select-arrow {
                    color: white !important;
                }
                .custom-dark-select .ant-select-dropdown {
                    background-color: #343F4D !important;
                }
            `}
            </style>
        </div>
    );
};

export default DropdownSelect;
