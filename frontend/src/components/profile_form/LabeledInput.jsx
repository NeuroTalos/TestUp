import React from 'react';
import { Input } from 'antd';
import { IMaskInput } from 'react-imask';

const LabeledInput = ({ label, value, maxLength, onChange, mask }) => {
    return (
        <div className="w-full">
            <label className="block text-white font-bold mb-2 ml-1">
                {label}
            </label>

            {mask ? (
                <IMaskInput
                    mask={mask}
                    value={value}
                    unmask={false}
                    onAccept={(value) =>
                        onChange({ target: { value } })
                    }
                    className="w-full px-2 py-1 rounded border border-[#283144] bg-transparent text-white"
                />
            ) : (
                <Input
                    value={value}
                    maxLength={maxLength}
                    onChange={onChange}
                    style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #283144',
                        color: 'white',
                    }}
                />
            )}
        </div>
    );
};

export default LabeledInput;
