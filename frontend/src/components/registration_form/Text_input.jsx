import React, { useState } from 'react';
import { Input } from 'antd';

const TextInput = ( {placeholder, maxLength, onChange} ) => {
  
  return (
    <div className="mb-3">
      <Input 
        size="large" 
        placeholder={placeholder} 
        maxLength={maxLength}
        onChange={onChange}
      />
    </div>
  )
};

export default TextInput;
