import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axiosInstance from '../utils/axios';
import { setBaseURL, setHeaders } from '../utils/axios';

const traer40Juegos = async () => {
    // Traemos juegos de RAWG
    setBaseURL('https://api.rawg.io');
    const datosRawg = await axiosInstance.get(`/api/games?key=${process.env.REACT_APP_RAWG_API_KEY}&page_size=40`);

    // Traemos juegos de Facundo
    setBaseURL('http://190.185.128.70:3003');
    setHeaders({
        'x-api-key': process.env.REACT_APP_FACUNDO_API_KEY
    });

    const datosFacundo = await axiosInstance.get(`/videogames?equipo=${process.env.REACT_APP_EQUIPO}`);

    return {
        datosRawg: datosRawg.data.results
            .map((m) => ({
                id: m.id,
                name: m.name,
                background_image: m.background_image,
                rating: m.rating,
                released: m.released,
            })),
        datosFacundo: datosFacundo.data
            .map((m) => ({
                id: m.id,
                name: m.name,
                background_image: m.backgroundImage,
                rating: m.rating,
                released: m.createdAt,
            }))
            .filter((f, id) => id < 40),
    };
};

const Inicio = () => {

    // Estado para controlar el juego a buscar

    const [ busqueda, setBusqueda ] = useState('');

    // Estado para controlar de dónde se hace la búsqueda

    const [ fuenteDatos, setFuenteDatos ] = useState('RAWG');

    // Traemos los 40 Juegos de RAWG y FACUNDO

    const { data: dataTraer40Juegos, error, isLoading } = useQuery({
        queryKey: ['dataTraer40Juegos'],
        queryFn: () => traer40Juegos(),
        refetchOnWindowFocus: false, // la consulta no se recuperará en el foco de la ventana, a pesar de que los datos esten obsoletos
    });

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-[#1F2937]" />
        </div>
    );

    if (error) return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg m-4" role="alert">
            <strong className="font-bold">Hubo un problema con la operación</strong><br/>
            <span className="block sm:inline">{ error.message }</span>
        </div>
    );

    // Funcion que busca un juego, en un tipo de fuente de datos (RAWG ó FACUNDO)

    const buscarJuego = () => {

        let datosDeJuego = [];

        if (fuenteDatos === 'RAWG') {

            datosDeJuego = dataTraer40Juegos.datosRawg;

        } else if (fuenteDatos === 'FACUNDO') {

            datosDeJuego = dataTraer40Juegos.datosFacundo;

        }

        return datosDeJuego.filter((juego) => juego.name.toLowerCase().includes(busqueda.toLowerCase()));
    };

    // constante listaDeJuegos, según la fuente seleccionada

    const listaDeJuegos = buscarJuego();

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
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <select
                    value={fuenteDatos}
                    onChange={(e) => setFuenteDatos(e.target.value)}
                    className="ml-4 p-2 border border-gray-300 rounded-lg"
                >
                    <option value="RAWG">Buscar en RAWG</option>
                    <option value="FACUNDO">Buscar en Facundo</option>
                </select>
            </div>

            {/* Lista de juegos */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(() => {
                    if (listaDeJuegos.length === 0) {
                        return (
                            <div className="col-span-full text-center text-lg text-gray-600">
                                No se encontraron juegos con ese nombre.
                            </div>
                        );
                    } else {
                        return listaDeJuegos.map((juego) => (
                            <li key={juego.id} className="bg-white rounded-lg shadow-md p-4">
                                <a href={`/videogame/${juego.id}`}>
                                    <h2 className="text-xl font-semibold mb-2">{juego.name}</h2>
                                    <img
                                        src={juego.background_image}
                                        alt={juego.name}
                                        className="w-full h-48 object-cover rounded mb-2"
                                    />
                                    <p className="text-gray-700">Rating: {juego.rating}</p>
                                    <p className="text-gray-700">Fecha de lanzamiento: {juego.released}</p>
                                    <p className="text-gray-700">Id: {juego.id}</p>
                                </a>
                            </li>
                        ));
                    }
                })()}
            </ul>
        </div>
    );
};

export default Inicio;
