import React from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const HomeWidget = () => {

    return (
        <div className="w-screen h-screen grid place-content-center">
            <h2>Домашняя страница</h2>
        </div>
    );
};

export default HomeWidget;