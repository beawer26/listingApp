
import axios from 'axios'
import store from '../store'
import { authLogout } from '../store/Auth/actions'

const version = 'v1'
const API_URL = (process.env.NODE_ENV === 'test') ? process.env.BASE_URL || (`https://api.listing2text.com/`) : `https://api.listing2text.com/`;

axios.defaults.baseURL = API_URL;
axios.defaults.headers.common.Accept = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'https://api.listing2text.com/';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// axios.interceptors.response.use(
//     response => response,
//     (error) => {
//
//         if (error.response.status === 401) {
//             //store.dispatch(authLogout())
//         }
//         return Promise.reject(error);
//     });

export default axios