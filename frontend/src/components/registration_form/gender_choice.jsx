import React from 'react';
import { Radio, Col, Row } from 'antd';

const GenderChoice = ( { onChange } ) => (
  <div className="mb-3 ml-35">
    <Radio.Group style={{ width: '100%' }} onChange={onChange}>
      <Row>
        <Col span={8}>
          <Radio value="male">Мужской</Radio>
        </Col>
        <Col span={8}>
          <Radio value="female">Женский</Radio>
        </Col>
      </Row>
    </Radio.Group>
  </div>
);

export default GenderChoice;