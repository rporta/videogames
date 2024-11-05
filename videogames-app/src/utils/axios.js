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
