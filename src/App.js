import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileUploader from './components/FileUploader';
import DataManager from './components/DataManager';

const App = () => {
    const [fileData, setFileData] = useState([]);

    const handleFileUploaded = (lines) => {
        setFileData(lines);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={<FileUploader onFileUploaded={handleFileUploaded} />}
                />
                <Route
                    path="/data"
                    element={<DataManager fileData={fileData} />}
                />
            </Routes>
        </Router>
    );
};

export default App;
