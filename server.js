const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const fs = require('fs')
var request = require('request');

app.get('/', function(request, response) {
    console.log('Home page visited!');
    const filePath = path.resolve(__dirname, './dist', 'index.html');

    // read in the index.html file
    fs.readFile(filePath, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }

        // replace the special strings with server generated strings
        data = data.replace(/\$OG_TITLE/g, 'Listing2text');
        result = data.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png');
        response.send(result);
    });
});

app.get('/listing-page/:token', function(req, response) {
    console.log('About page visited!');
    const filePath = path.resolve(__dirname, './dist', 'index.html')
    let agent_name = "";
    let agent_company = "";
    let buyer_name = "";
    let listing_params = req.params.token.split("_");

    fs.readFile(filePath, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        request.get('https://api.listing2text.com/buyers_list.json', function(err, res, body){
            let agent = JSON.parse(body);
            let listingId = req.params.token.split('_');
            if(agent[listingId[0]]) {
                agent_name = agent[listing_params[0]]['agent_name']
                buyer_name = agent[listing_params[0]]['buyer_name']
                agent_company = agent[listing_params[0]]['agent_company']
            }
            data = data.replace(/\$OG_TITLE/g, 'New Listing For '+buyer_name+'.');
            data = data.replace(/\$OG_URL/g, 'http://app.listing2text.com:3000/listing-page/'+req.params.token);
            data = data.replace(/\$OG_DESCRIPTION/g, "This listing was found just for you by "+agent_name+" at "+agent_company+".");
            data = data.replace(/\$OG_IMAGE_HTTPS/g, 'https://api.listing2text.com/upload/Listing/'+listing_params[1]+'.jpg');
            result = data.replace(/\$OG_IMAGE/g, 'https://api.listing2text.com/upload/Listing/'+listing_params[1]+'.jpg');
            response.send(result);

        })
    });
});

app.use(express.static(path.resolve(__dirname, './dist')));

app.get('*', function(request, response) {
    const filePath = path.resolve(__dirname, 'dist', 'index.html');
    response.sendFile(filePath);
});

app.listen(port, () => console.log(`Listening on port ${port}`));