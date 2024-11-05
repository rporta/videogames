Prompt: hazme una base de un proyecto npm con estas tecnologias: eact, React Router DOM, Axios, CSS, TailwindCSS y React Query

# Videogames-app

## Lista de comandos para crear base del proyecto:

- Primero ejecutaremos la creacion del proyecto, para ello ejecutar `npx create-react-app videogames-app`
- Luego iremos al directorio `videogames-app`
- Instalamos las dependencias que usaremos en el proyecto (React Router DOM, Axios, CSS, TailwindCSS y React Query): 
    - Instalamos (React Router DOM, Axios y React Query) `npm install react-router-dom axios react-query` 
    - Instalamos (TailwindCSS) `npm install -D tailwindcss postcss autoprefixer`
    - Creamos los archivos de configuracion de TailwindCSS `npx tailwindcss init -p`
- Luego, abre el archivo tailwind.config.js:
    - Le cargamos `content`, con `[ "./src/**/*.{js,jsx,ts,tsx}" ]`
- Crea un archivo CSS en `src/index.css` y lo abrimos:
    - Le cargamos:
```
@tailwind base;
@tailwind components;
@tailwind utilities;
```
- Configurar Axios (aca podemos hacer 2 instancias o trabajar con un method que cambie la baseURL y headers): 
```
// src/utils/axios.js

import axios from 'axios';

const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

// Función para cambiar el baseURL de Axios dinámicamente
export const setBaseURL = (url) => {
    axiosInstance.defaults.baseURL = url;
};

// Función para agregar headers
export const setHeaders = (header) => {
    axiosInstance.defaults.headers = {
        ...axiosInstance.defaults.headers,
        ...header,
    };
};

export default axiosInstance;

```
- Configurar React Query (envuelve tu aplicación con el proveedor `QueryClientProvider`):
```
// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './pages/Home';
import About from './pages/About';

const queryClient = new QueryClient();

function App() {
  return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="App">
                    <nav className="bg-gray-800 text-white p-4">
                        <ul className="flex space-x-4">
                            <li><a href="/" className="hover:text-gray-400">Home</a></li>
                            <li><a href="/about" className="hover:text-gray-400">About</a></li>
                        </ul>
                    </nav>
          
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                </div>
            </Router>
        </QueryClientProvider>
    );
}

export default App;

```
- Creamos archivo(.env) de entorno en la raiz del proyecto
```
REACT_APP_EQUIPO=5
REACT_APP_RAWG_API_KEY=ed928a8908754f0cbd94d62eb5e9343d
REACT_APP_FACUNDO_API_KEY=HzUES4ruMsTus9BLhBsFu85f0gEAzvdy
```
- Usa react-query:
```
import React from 'react';
import { useQuery } from 'react-query';
import axiosInstance from '../utils/axios';

const fetchData = async () => {
    const response = await axiosInstance.get('/endpoint'); // Cambia el endpoint
    return response.data;
};

const Home = () => {
    const { data, error, isLoading } = useQuery('data', fetchData);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Home Page</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

```
- Ejecuta el proyecto: `npm start`
---

# Estructura del proyecto

my-project/
├── node_modules/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── About.js
│   │   ├── Home.js
│   ├── utils/
│   │   └── axios.js
│   ├── App.js
│   ├── index.css
│   └── index.js
├── tailwind.config.js
├── package.json
└── README.md
