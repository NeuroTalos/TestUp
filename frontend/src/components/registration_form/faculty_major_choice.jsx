import React, { useEffect, useState } from 'react';
import { Input, Col, Row, Dropdown, Space, Typography} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import axios from 'axios';

const FacultyMajorInput = ( { onChangeFaculty, onChangeMajor } ) => {
    const [Faculties, setFaculties] = useState([]);
    const [Majors, setMajors] = useState([]);

    const fetchFacultiesMajors = () => {
        axios.get('http://127.0.0.1:8000/faculties').then(response =>
            {
                const FacultiesResponse = response.data
                const MajorsResponse = FacultiesResponse.map(faculty => faculty.majors).flat();

                const Faculties = FacultiesResponse.map((data) => ({
                    key: data.id.toString(),
                    label: data.name,
                  }));

                setFaculties(Faculties)
                
                const Majors = MajorsResponse.map((data) => ({
                    key: data.id.toString(),
                    label: data.name,
                  }));
                
                setMajors(Majors)
            }
        )
    }

    useEffect( () => {
        fetchFacultiesMajors()
    }, []);

    const handleFacultySelect = (key) => {
        const selected = Faculties.find(faculty => faculty.key === key);
        if (selected) {
            onChangeFaculty(selected.label);
        }
    };

    const handleMajorSelect = (key) => {
        const selected = Majors.find(major => major.key === key);
        if (selected) {
            onChangeMajor(selected.label); 
        }
    };
  
  return (
    <div className="mt-10 mb-3">
        <Row>
            <Col span={12}>
                <Dropdown
                    className='ml-5'
                    menu={{
                    items: Faculties,
                    selectable: true,
                    defaultSelectedKeys: ['1'],
                    onClick: (e) => handleFacultySelect(e.key),
                    }}
                >
                    <Typography.Link>
                    <Space>
                        Выберите факультет
                        <DownOutlined />
                    </Space>
                    </Typography.Link>
                </Dropdown>
            </Col>
            <Col span={12}>
            <Col span={12}>
                <Dropdown
                    className='ml-8'
                    menu={{
                    items: Majors,
                    selectable: true,
                    defaultSelectedKeys: ['1'],
                    onClick: (e) => handleMajorSelect(e.key),
                    }}
                >
                    <Typography.Link>
                    <Space>
                        Выберите направление
                        <DownOutlined />
                    </Space>
                    </Typography.Link>
                </Dropdown>
            </Col>
            </Col>
        </Row>
      </div>
  )
};

export default FacultyMajorInput;
