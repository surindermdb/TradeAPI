var express = require('express');
var bodyParser = require('body-parser');
const fetch = require('node-fetch');
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', async function (req, res) {
    
    let address=req.baseUrl.split('=')[1].toString();
    try {
        var requestOptions = {
            method: 'GET',
            headers: { "X-API-Key":"Lfl3OdBR0hK4rsrYOEhWYnj16nVC86FUKbFswG9OCtbdMum1o0PTNrU0cudKhclv" },
            redirect: 'follow'
        };
    
        var getData = await fetch("https://deep-index.moralis.io/api/v2/erc20/"+address+"/price?chain=bsc", requestOptions)
            .then(response =>
                response.json()
            )
            .then(result => {
                return result;
            })
            .catch(error => console.log('error', error));
    
        return res.status(200).json(getData);

    } catch (err) {

        //throw error in json response with status 500. 
        return res.status(400).json(err);
    }
});

module.exports = router;