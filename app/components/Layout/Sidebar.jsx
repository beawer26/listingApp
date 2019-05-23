import React from 'react';
import { Router, Route, Link, History, withRouter } from 'react-router-dom';
import pubsub from 'pubsub-js';
import { Collapse } from 'react-bootstrap';
import SidebarRun from './Sidebar.run';

class Sidebar extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            userBlockCollapse: false,
            collapse: {
                clients: this.routeActive('clients'),
                profile: this.routeActive('profile'),
                pages: false
            }
        };
        this.pubsub_token = pubsub.subscribe('toggleUserblock', () => {
            this.setState({
                userBlockCollapse: !this.state.userBlockCollapse
            });
        });
    };

    componentDidMount() {
        // pass navigator to access router api
        SidebarRun(this.navigator.bind(this));
    }

    navigator(route) {
        this.props.history.push(route);
    }

    componentWillUnmount() {
        // React removed me from the DOM, I have to unsubscribe from the pubsub using my token
        pubsub.unsubscribe(this.pubsub_token);
    }

    routeActive(paths) {
        paths = Array.isArray(paths) ? paths : [paths];
        if (paths.indexOf(this.props.location.pathname.replace('/','')) > -1)
            return true;
        return false;
    }

    toggleItemCollapse(stateName) {
        var newCollapseState = {};
        for (let c in this.state.collapse) {
            if (this.state.collapse[c] === true && c !== stateName)
                this.state.collapse[c] = false;
        }
        this.setState({
            collapse: {
                [stateName]: !this.state.collapse[stateName]
            }
        });
    }

    hideAside()
    {
        $('#mobile-aside').click();
    }

    render() {
        return (
            <aside className='aside'>
                { /* START Sidebar (left) */ }
                <div className="aside-inner">
                    <nav data-sidebar-anyclick-close="" className="sidebar">
                        { /* START sidebar nav */ }
                        <ul className="nav">

                            { /* Iterates over all sidebar items */ }
                            <li className="nav-heading ">
                                <span data-localize="sidebar.heading.HEADER">Main Navigation</span>
                            </li>
                            <li className={ this.routeActive(['profile', 'payment-info', 'change-password']) ? 'active' : '' }>
                                <div className="nav-item" title="Profile" onClick={ this.toggleItemCollapse.bind(this, 'profile') }>
                                    <em className="icon-notebook"></em>
                                    <span data-localize="sidebar.nav.PROFILE">Profile</span>
                                </div>
                                <Collapse in={ this.state.collapse.profile }>
                                    <ul id="#" className="nav sidebar-subnav">
                                        <li className="sidebar-subnav-header">Profile</li>
                                        <li className={ this.routeActive('profile') ? 'active' : '' }>
                                            <Link to="/profile" title="Profile">
                                                <span data-localize="sidebar.nav.element.PROFILE" onClick={this.hideAside.bind(this)}>Contact information</span>
                                            </Link>
                                        </li>
                                        <li className={ this.routeActive('payment-info') ? 'active' : '' }>
                                            <Link to="/payment-info" title="Payment information">
                                                <span data-localize="sidebar.nav.element.PAYMENT-INFO" onClick={this.hideAside.bind(this)}>Payment information</span>
                                            </Link>
                                        </li>
                                        <li className={ this.routeActive('change-password') ? 'active' : '' }>
                                            <Link to="/change-password" title="Change password">
                                                <span data-localize="sidebar.nav.element.PAYMENT-INFO" onClick={this.hideAside.bind(this)}>Change password</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </Collapse>
                            </li>
                            <li className={ this.routeActive('clients') ? 'active' : '' }>
                                <Link to="/clients" title="Buyers">
                                        <em className="icon-people"></em>
                                        <span data-localize="sidebar.nav.CLIENTS" onClick={this.hideAside.bind(this)}>Buyers</span>
                                </Link>
                            </li>
                        </ul>
                        { /* END sidebar nav */ }
                    </nav>
                </div>
                { /* END Sidebar (left) */ }
            </aside>
        );
    }

}

export default withRouter(Sidebar);
