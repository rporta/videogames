// Sección para mostrar los datos de un
// videogame específico obtenido de la api RAWG.

import React from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { setBaseURL } from '../utils/axios';
import { useQuery } from 'react-query';

const traerJuego = async (idBusqueda) => {

    // Traemos juegos de RAWG

    setBaseURL('https://api.rawg.io');
    const datosRawg = await axiosInstance.get(`/api/games/${idBusqueda}?key=${process.env.REACT_APP_RAWG_API_KEY}`)
        .catch(() => ({
            data: {
                detail: 'Not found.'
            }
        }));

    let dataJuego = [];

    // Cargamos el juego si hay datos de RAWG

    if (datosRawg.data?.detail !== "Not found.") {
        dataJuego = [
            datosRawg.data,
        ]
            .map((m) => ({
                id: m.id,
                name: m.name,
                background_image: m.background_image,
                rating: m.rating,
                released: m.released,
                description_raw: m.description_raw,
            }));
    }

    return dataJuego;

}

const Videogame = () => {

    const { id } = useParams();

    // Traemos el Juegos de RAWG, según 'id' de busqueda

    const { data: listaDeJuegos, isLoading, error } = useQuery({
        queryKey: ['juego', id],
        queryFn: () => traerJuego(id),
        refetchOnWindowFocus: false, // la consulta no se recuperará en el foco de la ventana, a pesar de que los datos esten obsoletos
        enabled: !!id,
    })

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

    return (
        <div className="container mx-auto p-4">

            {/* Titulo */}
            <h1 className="text-3xl font-bold text-center mb-8">Busqueda de Videojuegos, por id ({id})</h1>

            {/* Lista de juegos */}
            <ul className="flex justify-center items-center gap-6">
                {(() => {
                    if (listaDeJuegos?.length === 0) {
                        return (
                            <div className="col-span-full text-center text-lg text-gray-600">
                                No se encontraron juegos con ese id: {id}.
                            </div>
                        );
                    } else {
                        return listaDeJuegos?.map((juego) => (
                            <li key={juego.id} className="bg-[#DBDBDB] rounded-lg shadow-md p-4 ">
                                <h2 className="text-xl font-semibold mb-2">{juego.name}</h2>
                                <img
                                    src={juego.background_image}
                                    alt={juego.name}
                                    className="w-[360px] h-[360px] object-cover rounded mb-2"
                                />
                                <p className="text-gray-700">Rating: {juego.rating}</p>
                                <p className="text-gray-700">Fecha de lanzamiento: {juego.released}</p>
                                <p className="text-gray-700">
                                    Descripcion:
                                </p>
                                <pre className="text-wrap text-[green] bg-[black] rounded-lg my-4 p-4">{juego.description_raw}</pre>
                            </li>
                        ));
                    }
                })()}
            </ul>
        </div>
    );
};

export default Videogame;
