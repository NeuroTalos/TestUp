import React from 'react';
import { Card } from 'antd';

const AuthInfo = () => {
    return (
        <div className="p-6 w-full">
            <Card
                title="Учётные данные"
                styles={{
                    header: {
                        borderBottom: '2px solid #283144',
                        color: 'white',
                        backgroundColor: '#343F4D'
                    }
                }}
                style={{ 
                    backgroundColor: '#343F4D',
                    border: '1px solid #283144', 
                }}
            >
                <div className="text-white mb-4"><strong>Логин:</strong> Логин </div>
            </Card>
        </div>
    );
};

export default AuthInfo;
