import React from 'react';
import { Input, InputNumber, Col, Row} from 'antd';

const StudyInfoInput = ( { onChangeCourse, onChangeGroup } ) => {
  
  return (
    <div className="mb-3">
      <Row>
        <Col span={12}>
          <InputNumber
            min={1}
            max={5}
            placeholder="Укажите свой курс"
            style={{ width: '90%' }}
            onChange={onChangeCourse}
          />
        </Col>
        <Col span={12}>
          <Input  
            placeholder="Укажите название группы"
            maxLength={15}
            onChange={onChangeGroup}
          />
        </Col>
      </Row>
    </div>
  )
  };
  
  export default StudyInfoInput;
  