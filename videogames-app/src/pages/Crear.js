// Sección principal donde se mostrará un catálogo de hasta 40
// Videogames. Esta sección deberá incluir un campo de búsqueda, con la opción
// para elegir entre buscar en la API RAWG o en la base de datos de videogames
// creadas, y buscar por nombre del videogame.

import React from 'react';
import { useQuery } from 'react-query';
import axiosInstance from '../utils/axios';
import { setBaseURL, setHeaders } from '../utils/axios';

const traer40Juegos = async () => {

    // traemos juegos de RAWG

    setBaseURL('https://api.rawg.io')

    const datosRawg = await axiosInstance.get(`/api/games?key=ed928a8908754f0cbd94d62eb5e9343d`);

    // traemos juegos de Facundo

    setBaseURL('http://190.185.128.70:3003')
    setHeaders({
        'x-api-key': 'HzUES4ruMsTus9BLhBsFu85f0gEAzvdy'
    })

    const datosFacundo = await axiosInstance.get('/videogames?equipo=5');

    return {
        datosRawg: datosRawg.data.results,
        datosFacundo: datosFacundo.data,
    }

};



const Crear = () => {

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Crear Page</h1>
      <p>Bienvenido a la página de Crear.</p>
    </div>
  );
};

export default Crear;