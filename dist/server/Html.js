export default (html, head) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCyfIU7parEG6LMB1TfwCirUyIMThI_tr4&v=3&libraries=places" type="text/javascript"></script>
    <script type="text/javascript" src="https://js.stripe.com/v2/"></script>
    <link rel="icon" href="/img/favicon.ico" type="image/x-icon">
    <title>Listing2Text</title>
    ${head.meta.toString()}
    </head>
    <body>
        <div id="app">${html}</div>
    </body>
    </html>
`;