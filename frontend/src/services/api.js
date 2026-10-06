import axios from 'axios';

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        'http://localhost:3000/api'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

const GRAPHQL_URL =
    (
        import.meta.env.VITE_API_URL ||
        'http://localhost:3000/api'
    ).replace(/\/api\/?$/, '') + '/graphql';

export async function graphql(query, variables = {}) {
    const { data } = await api.post(GRAPHQL_URL, {
        query,
        variables
    });

    if (data.errors?.length) {
        throw new Error(data.errors[0].message);
    }

    return data.data;
}

export default api;