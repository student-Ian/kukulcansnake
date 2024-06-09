import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import './App.css';
import CustomRoutes from "./CustomRoutes";


const App = () => {
    return (
        <Router>
            <div style={{height: "42px", padding: "2vh"}}></div>
            <CustomRoutes/>
        </Router>
    );
};

export default App;
