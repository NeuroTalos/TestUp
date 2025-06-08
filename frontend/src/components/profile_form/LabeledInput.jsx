import React from 'react';
import { Input } from 'antd';
import { IMaskInput } from 'react-imask';

const LabeledInput = ({ label, value, maxLength, minLength, onChange, mask }) => {
    const isTooShort = minLength && value.length > 0 && value.length < minLength;

    return (
        <div className="w-full mt-3">
            <label className="block text-white font-bold mb-1 ml-1">
                {label}
            </label>

            {mask ? (
                <IMaskInput
                    mask={mask}
                    value={value}
                    unmask={false}
                    onAccept={(val) => onChange({ target: { value: val } })}
                    className={`w-full px-2 py-1 rounded border ${
                        isTooShort ? 'border-red-500' : 'border-[#283144]'
                    } bg-transparent text-white`}
                />
            ) : (
                <Input
                    value={value}
                    maxLength={maxLength}
                    onChange={onChange}
                    style={{
                        backgroundColor: 'transparent',
                        border: isTooShort ? '1px solid #f87171' : '1px solid #283144',
                        color: 'white',
                    }}
                />
            )}

            {isTooShort && (
                <div className="text-red-500 text-sm mt-1 ml-1">
                    Минимум {minLength} символ{minLength === 1 ? '' : 'ов'}
                </div>
            )}
        </div>
    );
};

export default LabeledInput;
