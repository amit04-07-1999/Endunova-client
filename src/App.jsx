import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './component/Sidebar';
import Overview from './pages/Overview';
import PeopleTable from './pages/PeopleTable';
import Navbar from './component/Navbar';

function App() {
    return (
        <BrowserRouter>
        <Navbar/>
            <div className="flex">
                <Sidebar />
                <div className="flex-1 p-6 bg-background">
                    <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/people-directory" element={<PeopleTable />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;