import React from 'react';
import { FaVk, FaTelegramPlane, FaLinkedin, FaGithub } from 'react-icons/fa'; // Импортируем иконки
import { Row, Col } from 'antd';
import './Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer" style={{ backgroundColor: '#001529' }}>
      <div className="content">
        <Row justify="center" gutter={[16, 16]}>
          <Col span={24}>
            <h3 style={{ margin: 0, color: '#fff' }}>TestUP</h3>
            <p style={{ color: '#fff', margin: '5px 0' }}>© {new Date().getFullYear()} Все права защищены</p>
          </Col>

          <Col span={24}>
            <a className="footer-link">О нас</a> |{' '}
            <a className="footer-link">Контакты</a> |{' '}
            <a className="footer-link">Политика конфиденциальности</a>
          </Col>

          <Col span={24} className="social-icons-container">
            <a target="_blank" rel="noopener noreferrer" className="social-link">
              <FaVk className="icon" />
            </a>
            <a target="_blank" rel="noopener noreferrer" className="social-link">
              <FaTelegramPlane className="icon" />
            </a>
            <a target="_blank" rel="noopener noreferrer" className="social-link">
              <FaLinkedin className="icon" />
            </a>
            <a target="_blank" rel="noopener noreferrer" className="social-link">
              <FaGithub className="icon" />
            </a>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;
