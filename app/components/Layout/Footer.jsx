import React from 'react';

class Footer extends React.Component {

    render() {
        return (
            <footer>
                <span>&copy; 2019 - Listing2Text</span>
                <a id="terms-link" href="https://listing2text.com/terms-of-use/">Terms of use</a>
                <a id="privacy-link" href="https://listing2text.com/privacy-policy/">Privacy Policy</a>
                <a id="support-link" href="http://support.listing2text.com/">Support</a>
            </footer>
        );
    }

}

export default Footer;
