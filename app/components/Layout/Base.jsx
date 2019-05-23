import React from 'react';

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {History, Redirect } from 'react-router-dom';

// import services actions
import { fetchUser } from '../../utils/service'
import {authCheck} from '../../store/Auth/actions'
import Header from './Header'
import Sidebar from './Sidebar'
import Offsidebar from './Offsidebar'
import Footer from './Footer'
import Http from '../../utils/http'

class Base extends React.Component {

    constructor(props){
        super(props);
        this.props.dispatch(authCheck())
        this.props.dispatch(fetchUser())
    }

    componentDidUpdate()
    {
        const user = localStorage.getItem('user_id');
        if(user && (typeof this.props.isAuthenticated !== 'undefined') && this.props.isAuthenticated !== false) {
            Http.post('check-status/' + user)
                .then(res => {
                    localStorage.setItem('user_status', res['data'])
                })
                .catch(err => {

                })
        }
        else{
            this.props.history.push("/login")
        }
    }

    render() {
        if (typeof this.props.isAuthenticated !== 'undefined' && this.props.isAuthenticated === false) {
            return <Redirect to="/login" />
        }
            return (
                <div className="wrapper">
                    <Header/>

                    <Sidebar/>

                    <Offsidebar/>

                    <section>
                        {this.props.children}
                    </section>

                    <Footer/>
                </div>
            );
        }

}
Base.propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.isAuthenticated,
        user: state.user,
    }
}

export default connect(mapStateToProps)(Base);
