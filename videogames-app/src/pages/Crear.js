// Sección con un formulario para añadir nuevos videogames
// a la base de datos del servidor de Facu.

import React, { useState } from 'react';
import axiosInstance from '../utils/axios';
import { setBaseURL, setHeaders } from '../utils/axios';

// Funcion que se invoca al dar click en el boton Crear

const accionCrearJuego = async (juego, setValidCreateGame, setErrorDescription) => {

    // Traemos juegos de Facundo

    setBaseURL('http://190.185.128.70:3003');
    setHeaders({
        'x-api-key': process.env.REACT_APP_FACUNDO_API_KEY
    });

    let operacion = false;

    try {

        const rsOperacion = await axiosInstance.post('/videogames', {
            name: juego.name,
            backgroundImage: juego.background_image,
            rating: juego.rating,
            team: process.env.REACT_APP_EQUIPO,
        })
            .catch((e) => false);

        if (rsOperacion.data?.message) {
            setErrorDescription(rsOperacion.data.message)
        } else {
            setErrorDescription(null)
        }

        if (rsOperacion.data?.created) {
            operacion = true;
        }

    } catch (error) {
        // Error en la operacion
    }

    setValidCreateGame(operacion);

}


const Crear = () => {

    // Estado para controlar el Nombre del juego a crear

    const [ name, setName ] = useState('');

    // Estado para controlar la URL de la Imagen del juego a crear

    const [ urlImg, setUrlImg ] = useState('');

    // Estado para controlar la Puntuación del juego a crear

    const [ rating, setRating ] = useState('');

    // Estado para controlar que la URL de la Imagen del juego, sea valida

    const [ validUrlImg, setValidUrlImg ] = useState('');

    // Estado para controlar si el juego se creo correctamente

    const [ validCreateGame, setValidCreateGame ] = useState(null);

    // Estado para controlar el mensaje de error de la operacion
    const [ errorDescription, setErrorDescription ] = useState(null);

    // Funcion que valida si la URL de la Imagen del juego, es valida

    async function checkValidUrlImg(url) {

        const isValid = await new Promise((resolve) => {

            let img = new Image();
            img.onload = () => resolve(true);  // Si se carga correctamente, es una imagen
            img.onerror = () => resolve(false); // Si ocurre un error al cargar, no es una imagen
            img.src = url;  // Asignamos la URL a la propiedad 'src'

        });

        // Guardamos el Estado (validUrlImg)

        setValidUrlImg(isValid);

        return isValid;
    }


    // Funcion que crea un juego, usando los Estados disponibles

    const crearJuego = () => {

        let games = [];

        let patternUrl = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

        // Si tenemos cargada la url, validamos que sea una url

        if (urlImg.length > 0 && patternUrl.test(urlImg)) {

            // validamos si una imagen

            checkValidUrlImg(urlImg)
        }

        // Consulto si tengo datos en los Estados (name, rating),
        // y si es una url de imagen valida en el Estado (validUrlImg)

        if (name.length > 0 && urlImg.length > 0 && validUrlImg && rating.length > 0) {

            games = [
                {
                    name,
                    background_image: urlImg,
                    rating,
                },
            ];
        }

        return games;
    }

    // Funcion que crea el color del BotonCrear
    const crearColorBotonCrear = () => {

        let color = 'bg-gray-500';

        // consulto si es una url de imagen valida en el Estado (validUrlImg),
        // y si fue posible crear la listaDeJuegos, con 1 item
        if (validUrlImg && listaDeJuegos.length > 0) {
            color = 'bg-green-500'
        }

        return color;
    }

    // Funcion que limpia los datos
    const limpiarDatos = () => {
        setName('');
        setUrlImg('');
        setRating('');
        setValidUrlImg('');
        setValidCreateGame(null);
        setErrorDescription(null);
    }

    // constante listaDeJuegos, según los datos del formulario

    const listaDeJuegos = crearJuego();

    // constante para el color del boton Crear

    const colorBotonCrear = crearColorBotonCrear();

    return (
        <div className="container mx-auto p-4">

            {/*alerta*/}
            {(() => {
                if (validCreateGame === true) return (
                    <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg" role="alert">
                        <strong class="font-bold">Éxito se creo el juego</strong><br/>
                        <span class="block sm:inline">La operación se completó con éxito.</span>
                    </div>
                );
                if (validCreateGame === false) return (
                    <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                        <strong class="font-bold">Hubo un problema con la operación</strong><br/>
                        <span class="block sm:inline">{ errorDescription }</span>
                    </div>
                );
            })()}


            {/*Título*/}
            <h1 className="text-2xl font-bold">Crear</h1>

            <p>Bienvenido a la página de Crear, para añadir nuevos videogames. </p>


            {/*Formulario*/}
            <form className="bg-white p-8 rounded-lg shadow-lg space-y-6">

                {/*Grid Layout: Nombre, URL de imagen y Puntuación*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/*Campo Nombre*/}
                    <div className="flex flex-col">
                        <label htmlFor="nombre" className="text-lg font-medium text-gray-700 mb-2">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            />
                    </div>

                    {/*Campo URL de la Imagen*/}
                    <div className="flex flex-col">
                        <label htmlFor="urlImg" className="text-lg font-medium text-gray-700 mb-2">URL de la Imagen</label>
                        <input
                            type="url"
                            id="urlImg"
                            name="urlImg"
                            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            value={urlImg}
                            onChange={(e) => setUrlImg(e.target.value)}
                            />
                    </div>

                    {/*Campo Puntuación*/}
                    <div className="flex flex-col">
                        <label htmlFor="puntuacion" className="text-lg font-medium text-gray-700 mb-2">Puntuación</label>
                        <input
                            type="number"
                            id="puntuacion"
                            name="puntuacion"
                            className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                            max="10"
                            required
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            />
                    </div>

                </div>

                {/* Lista de juegos */}
                {(() => {
                    if (validUrlImg)
                        return (
                            <ul className="flex justify-center items-center gap-6 p-4">
                                {
                                    listaDeJuegos.map((juego, id) => (
                                        <li key={id} className="bg-[#F2F7FF] rounded-lg shadow-md p-4 ">
                                            <h2 className="text-xl font-semibold mb-2">{juego.name}</h2>
                                            <img
                                                src={juego.background_image}
                                                alt={juego.name}
                                                className="w-full h-48 object-cover rounded mb-2"
                                            />
                                            <p className="text-gray-700">Rating: {juego.rating}</p>
                                        </li>
                                    ))
                                }
                            </ul>
                        )
                    }
                )()}

                {/*Botón de Envío*/}
                <div className="flex justify-end gap-6">

                    <button
                        type="button"
                        className='bg-red-500 text-white px-6 py-3 rounded-md font-semibold  transition-colors'
                        onClick={() => limpiarDatos()}
                        >
                        Limpiar datos
                    </button>
                    <button
                        type="button"
                        key={colorBotonCrear}
                        disabled={!(listaDeJuegos.length > 0)}
                        className={
                            `${colorBotonCrear} text-white px-6 py-3 rounded-md font-semibold  transition-colors`

                            }
                        onClick={() => accionCrearJuego(listaDeJuegos[0], setValidCreateGame, setErrorDescription)}
                        >
                        Crear
                    </button>
                </div>

            </form>


        </div>
    );
};

export default Crear;
