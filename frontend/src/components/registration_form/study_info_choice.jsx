import React from 'react';
import { InputNumber} from 'antd';

const StudyInfoInput = () => {
  
    return (
      <div className="mb-3">
        <InputNumber
            min={1}
            max={5}
            placeholder="Укажите свой курс"
            style={{ width: '33%' }}
        />
      </div>
    )
  };
  
  export default StudyInfoInput;
  