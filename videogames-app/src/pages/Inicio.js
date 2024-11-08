import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axiosInstance from '../utils/axios';
import { setBaseURL, setHeaders } from '../utils/axios';

const traer40Juegos = async () => {
    // Traemos juegos de RAWG
    setBaseURL('https://api.rawg.io');
    const datosRawg = await axiosInstance.get(`/api/games?key=ed928a8908754f0cbd94d62eb5e9343d`);

    // Traemos juegos de Facundo
    setBaseURL('http://190.185.128.70:3003');
    setHeaders({
        'x-api-key': 'HzUES4ruMsTus9BLhBsFu85f0gEAzvdy'
    });

    const datosFacundo = await axiosInstance.get('/videogames?equipo=5');

    return {
        datosRawg: datosRawg.data.results
            .map((m) => ({
                id: m.id,
                name: m.name,
                background_image: m.background_image,
                rating: m.rating,
                released: m.released,
            })),
        datosFacundo: datosFacundo.data,
    };
};

const Inicio = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [source, setSource] = useState('RAWG'); // Estado para controlar de dónde se hace la búsqueda

    const { data: dataTraer40Juegos, error, isLoading } = useQuery('dataTraer40Juegos', traer40Juegos);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    // Función de filtrado de juegos
    const filteredGames = (games) => {
        return games.filter((game) => game.name.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    // Juegos a mostrar según la fuente seleccionada
    const gamesToDisplay = source === 'RAWG' ? filteredGames(dataTraer40Juegos.datosRawg) : filteredGames(dataTraer40Juegos.datosFacundo);

    return (
        <div className="container mx-auto p-4">

            {/* Titulo */}
            <h1 className="text-3xl font-bold text-center mb-8">Lista de Videojuegos</h1>

            {/* Buscador */}
            <div className="mb-6 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    className="p-2 border border-gray-300 rounded-lg w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="ml-4 p-2 border border-gray-300 rounded-lg"
                >
                    <option value="RAWG">Buscar en RAWG</option>
                    <option value="FACUNDO">Buscar en Facundo</option>
                </select>
            </div>

            {/* Lista de juegos */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gamesToDisplay.length === 0 ? (
                    <div className="col-span-full text-center text-lg text-gray-600">No se encontraron juegos con ese nombre.</div>
                ) : (
                    gamesToDisplay.filter((game, idx) => idx < 40).map((game) => (
                        <li key={game.id} className="bg-white rounded-lg shadow-md p-4">
                            <h2 className="text-xl font-semibold mb-2">{game.name}</h2>
                            <img
                                src={game.background_image}
                                alt={game.name}
                                className="w-full h-48 object-cover rounded mb-2"
                            />
                            <p className="text-gray-700">Rating: {game.rating}</p>
                            <p className="text-gray-700">Fecha de lanzamiento: {game.released}</p>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Inicio;
