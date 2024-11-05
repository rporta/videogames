import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Videogame from './pages/Videogame';
import Crear from './pages/Crear';

function App() {
    return (
        <Router>
            <div className="App">
                <nav className="bg-gray-800 text-white p-4">
                    <ul className="flex space-x-4">
                        <li><a href="/" className="hover:text-gray-400">Inicio</a></li>
                        <li><a href="/videogame/1" className="hover:text-gray-400">Videogame</a></li>
                        <li><a href="/crear" className="hover:text-gray-400">Crear</a></li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/videogame/:id" element={<Videogame />} />
                    <Route path="/crear" element={<Crear />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
