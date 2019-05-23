import React from 'react';



class RegisterHeader extends React.Component {

    constructor(props){
        super(props)

    }


    render() {

        return (
            <header className="topnavbar-wrapper">
                { /* START Top Navbar */ }
                <nav role="navigation" className="navbar topnavbar">
                    { /* START navbar header */ }
                    <div className="navbar-header">
                        <a href="https://listing2text.com/" className="navbar-brand">
                            <div className="navbar-header">
                                <div className="brand-logo">
                                    <img src="/img/logowhite.png" alt="App Logo" className="img-responsive" />
                                </div>
                                <div className="brand-logo-collapsed">
                                    <img src="/img/icon.png" alt="App Logo" className="img-responsive" />
                                </div>
                            </div>
                        </a>
                    </div>
                    { /* END navbar header */ }
                    { /* START Nav wrapper */ }
                    <div className="nav-wrapper">
                        { /* START Left navbar */ }
                        <ul className="nav navbar-nav">

                            { /* START User avatar toggle */ }

                            { /* END User avatar toggle */ }

                        </ul>
                        { /* END Left navbar */ }
                        { /* START Right Navbar */ }
                        { /* END Right Navbar */ }
                    </div>

                </nav>

            </header>
        );
    }

}


export default RegisterHeader;
