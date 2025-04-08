import React from 'react';
import { Radio, Col, Row } from 'antd';

const GenderChoice = () => (
  <div className="mb-3 ml-35">
    <Radio.Group style={{ width: '100%' }}>
      <Row>
        <Col span={8}>
          <Radio value="Мужской">Мужской</Radio>
        </Col>
        <Col span={8}>
          <Radio value="Женский">Женский</Radio>
        </Col>
      </Row>
    </Radio.Group>
  </div>
);

export default GenderChoice;