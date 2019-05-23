import React from 'react';

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {History, Redirect } from 'react-router-dom';

// import services actions
import { fetchUser } from '../../utils/service'
import {authCheck} from '../../store/Auth/actions'
import Header from './Header'
import AdminSidebar from './AdminSidebar'
import Offsidebar from './Offsidebar'
import Footer from './Footer'

class AdminBase extends React.Component {

    constructor(props){
        super(props);
        this.props.dispatch(authCheck())
        this.props.dispatch(fetchUser())
    }

    render() {
        if (typeof this.props.isAuthenticated !== 'undefined' && this.props.isAuthenticated === false) {
            return <Redirect to="/login" />
        }
            return (
                <div className="wrapper">
                    <Header/>

                    <AdminSidebar/>

                    <Offsidebar/>

                    <section>
                        {this.props.children}
                    </section>

                    <Footer/>
                </div>
            );


    }

}
AdminBase.propTypes = {
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

export default connect(mapStateToProps)(AdminBase);
