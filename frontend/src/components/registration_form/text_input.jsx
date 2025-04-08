import React, { useState } from 'react';
import { Input } from 'antd';

const TextInput = ( {placeholder, maxLength} ) => {
  
  return (
    <div className="mb-3">
      <Input 
        size="large" 
        placeholder={placeholder} 
        maxLength={maxLength}
      />
    </div>
  )
};

export default TextInput;
