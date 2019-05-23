import React from 'react';
import pubsub from 'pubsub-js';
import HeaderRun from './Header.run'
import { NavDropdown, MenuItem, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../../utils/service'

// Necessary to create listGroup inside navigation items
class CustomListGroup extends React.Component {
  render() {
    return (
      <ul className="list-group">
        {this.props.children}
      </ul>
    );
  }
}

class Header extends React.Component {

    constructor(props){
        super(props)
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {

        HeaderRun();

    }

    toggleUserblock(e) {
        e.preventDefault();
        pubsub.publish('toggleUserblock');
    }

    logout(e){
        e.preventDefault()

        this.props.dispatch(logout())
    }

    render() {
        const navDropdownTitle = (<span>
                <em className="icon-user"></em>
            </span>);
        const ddAlertTitle = (
            <span>
                <em className="icon-bell"></em>
                <span className="label label-danger">11</span>
            </span>
        )
        return (
            <header className="topnavbar-wrapper">
                { /* START Top Navbar */ }
                <nav role="navigation" className="navbar topnavbar">
                    { /* START navbar header */ }
                    <div className="navbar-header">
                        <a href="https://listing2text.com/" className="navbar-brand">
                            <div className="navbar-header">
                                    <div className="brand-logo">
                                        <img src="img/logowhite.png" alt="App Logo" className="img-responsive" />
                                    </div>
                                    <div className="brand-logo-collapsed">
                                        <img src="img/icon.png" alt="App Logo" className="img-responsive" />
                                    </div>
                            </div>
                        </a>
                    </div>
                    { /* END navbar header */ }
                    { /* START Nav wrapper */ }
                    <div className="nav-wrapper">
                        { /* START Left navbar */ }
                        <ul className="nav navbar-nav">
                            <li>
                                { /* Button used to collapse the left sidebar. Only visible on tablet and desktops */ }
                                <a href="#" id="desktop-aside" data-trigger-resize="" data-toggle-state="aside-collapsed" className="hidden-xs">
                                    <em className="fa fa-navicon"></em>
                                </a>
                                { /* Button to show/hide the sidebar on mobile. Visible on mobile only. */ }
                                <a href="#" id="mobile-aside" data-toggle-state="aside-toggled" data-no-persist="true" className="visible-xs sidebar-toggle">
                                    <em className="fa fa-navicon"></em>
                                </a>
                            </li>
                            { /* START User avatar toggle */ }
                                <NavDropdown noCaret eventKey={ 3 } title={ navDropdownTitle } className="dropdown-list" id="basic-nav-dropdown" >
                                    <CustomListGroup>
                                        <ListGroupItem href="javascript:void(0)">
                                            Hello, {localStorage.getItem('user_name')}
                                            <br />
                                        </ListGroupItem>
                                        <ListGroupItem href="javascript:void(0)">
                                            <div className="media-box">

                                                <div className="pull-left">
                                                    <em className="fa fa-door-open fa-2x text-info"></em>
                                                </div>
                                                <div className="media-box-body clearfix" onClick={this.logout}>
                                                        <p className="m0">Logout</p>
                                                </div>
                                            </div>
                                        </ListGroupItem>
                                    </CustomListGroup>
                                </NavDropdown>

                            { /* END User avatar toggle */ }

                        </ul>
                        { /* END Left navbar */ }
                        { /* START Right Navbar */ }
                        { /* END Right Navbar */ }
                    </div>
                    { /* END Nav wrapper */ }
                    { /* START Search form */ }
                    <form role="search" action="search.html" className="navbar-form">
                        <div className="form-group has-feedback">
                            <input type="text" placeholder="Type and hit enter ..." className="form-control" />
                            <div data-search-dismiss="" className="fa fa-times form-control-feedback"></div>
                        </div>
                        <button type="submit" className="hidden btn btn-default">Submit</button>
                    </form>
                    { /* END Search form */ }
                </nav>
                { /* END Top Navbar */ }
            </header>
            );
    }

}

Header.propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.isAuthenticated,
        user: state.user
    }
}

export default connect(mapStateToProps)(Header);
