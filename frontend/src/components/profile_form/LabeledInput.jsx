import React from 'react';
import { Input } from 'antd';

const LabeledInput = ({ label, value, onChange }) => {
    return (
        <div style={{ width: '220px', marginRight: '16px' }}>
            <label 
                style={{ 
                    color: 'white', 
                    display: 'block', 
                    marginLeft: '1px',
                    marginBottom: '6px',  
                    fontWeight: 'bold' 
                }}>
                {label}
            </label>
            <Input
                value={value}
                onChange={onChange}
                style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #283144',
                    color: 'white',
                }}
            />
        </div>
    );
};

export default LabeledInput;
