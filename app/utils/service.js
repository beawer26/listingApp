import Http from './http'
import * as authActions from '../store/Auth/actions'
import Transformer from './Transformer'

/**
 * fetch the current logged in user
 *
 * @returns {function(*)}
 */
export function fetchUser() {
    return dispatch => {
        return Http.get('api/user')
            .then(res => {
                const data = Transformer.fetch(res.data)
                dispatch(authActions.authUser(data))
            })
            .catch(err => {
            })
    }
}

export function getProfile(user_id) {
    return dispatch => {
        return Http.get('profiles/'+user_id)
            .then(res => {
                const data = Transformer.fetch(res.data)
                dispatch(authActions.getProfile(data))
            })
            .catch(err => {
            })
    }
}

export function updateProfile(id, credentials) {
    return dispatch => (
        new Promise((resolve, reject) => {
            Http.put('profile/'+id, credentials)
                .then(res => {
                    return resolve()
                })
                .catch((err) => {

                })
        })
    )
}


/**
 * login user
 *
 * @param credentials
 * @returns {function(*)}
 */

export function login(credentials) {
    return dispatch => (
        new Promise((resolve, reject) => {
            Http.post('api/login', credentials)
                .then(res => {
                    const data = Transformer.fetch(res.data)
                    dispatch(authActions.authLogin(data))
                    fetchUser();
                    return resolve()
                })
                .catch((err) => {
                    const statusCode = err.response.status;
                    const data = {
                        error: null,
                        statusCode,
                    };

                    if (statusCode === 422) {
                        const resetErrors = {
                            errors: err.response.data.errors,
                            replace: false,
                            searchStr: '',
                            replaceStr: '',
                        };
                        data.error = Transformer.resetValidationFields(resetErrors);
                    } else if (statusCode === 401) {
                        data.error = "Invalid email or password";
                    } else if(statusCode === 302){
                        data.error = "Your email needs to be verificated"
                    }
                    return reject(data);
                })
        })
    )
}

/**
 * logout user
 *
 * @returns {function(*)}
 */
export function logout() {
    return dispatch => {
        return Http.delete('api/logout')
            .then(() => {
                dispatch(authActions.authLogout())
            })
            .catch(err => {

            })
    }
}