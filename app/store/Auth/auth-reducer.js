import HTTP from '../../utils/http';
import { createStore } from 'redux';
import {
    AUTH_CHECK,
    AUTH_LOGIN,
    AUTH_LOGOUT,
    AUTH_REFRESH_TOKEN,
    AUTH_RESET_PASSWORD,
    AUTH_USER,
    GET_PROFILE
} from './action-types';

const initialState = {
    isAuthenticated: false
};

function reducer  (state = initialState, { type, payload = null })  {
    switch(type) {
        case AUTH_REFRESH_TOKEN:
        case AUTH_LOGIN:
            return login(state, payload);
        case AUTH_CHECK:
            return checkAuth(state);
        case AUTH_LOGOUT:
            return logout(state);
        case AUTH_RESET_PASSWORD:
            return resetPassword(state);
        case AUTH_USER:
            return checkUser(state, payload);
        case GET_PROFILE:
            return getProfile(state, payload);
        default:
            return state;
    }
};

function login(state, payload) {

    localStorage.setItem('access_token', payload.accessToken);
    localStorage.setItem('user_id', payload.userId);
    HTTP.defaults.headers.common['Authorization'] = `Bearer ${payload}`;

    return {
        ...state, isAuthenticated: true,
    }
}

function getProfile(state, payload) {
    state = Object.assign({}, state,{
        profile: payload
    })

    return state
}

function checkAuth(state) {
    state = Object.assign({}, state, {
        isAuthenticated: !!localStorage.getItem('access_token')
    })

    if (state.isAuthenticated) {
        HTTP.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
    }

    return state;
}

function logout(state) {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_name')

    return {
        ...state, isAuthenticated: false, user: {},
    }
}

function resetPassword(state) {
    return {
        ...state, resetPassword: true,
    }
}

function checkUser(state, payload){
    state = Object.assign({}, state,{
        user: payload
    })
    localStorage.setItem('user_id', payload.id);
    localStorage.setItem('user_name', payload.name)

    return state
}

export const getAuth = state => state.auth.isAuthenticated;

export default reducer;