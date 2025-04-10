import React from 'react';
import { Link } from 'react-router-dom';


const HomeWidget = () => {
    return (
        <div className="w-screen h-screen grid place-content-center">
            <h2>Домашняя страница</h2>
            <br/>
            <Link to="/registration">Зарегестрироваться</Link>
        </div>
    );
};

export default HomeWidget;