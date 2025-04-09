import React from 'react';
import { Button, Flex } from 'antd';

const RegistrationButton = ({ onClick }) => {
  
    return (
      <div className="mt-6 ml-45">
        <Flex gap="small" wrap>
            <Button 
                type="primary"
                onClick={onClick}
            >
                 Зарегистрироваться
            </Button>
        </Flex>
      </div>
    )
  };
  
  export default RegistrationButton;
  