var express = require('express');
var bodyParser = require('body-parser');
const fetch = require('node-fetch');
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());



// RETURNS ALL THE USERS IN THE DATABASE
router.post('/', async function (req, res) {

    let searchTxt = req.baseUrl.split('=')[1].toString();

    try {
        // `+searchTxt.toUpperCase()+`
        const query = `
            {
                search(string: "`+searchTxt.toUpperCase()+`",network: bsc){
                    network{
                        network
                    }
                    subject{
                        __typename
                        ... on Address {
                            address
                            annotation
                        }
                        ... on Currency {
                            symbol
                            name
                            address
                            tokenId
                            tokenType
                            
                        }
                        ... on SmartContract {
                            address
                            annotation
                            contractType
                            protocol
                        }
                        ... on TransactionHash {
                            hash
                        }
                        }
                }
            }

            `;
        const url = "https://graphql.bitquery.io/";
        const opts = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": "BQYXVgFy33rjBJCXSjVN6yeVcrfd5dS8"
            },
            body: JSON.stringify({
                query
            })
        };
        var getData = await fetch(url, opts)
            .then(response =>
                response.json()
            )
            .then(result => {return result;})
            .catch(console.error);
        
        return res.status(200).json(getData);

        // var requestOptions = {
        //     method: 'GET',
        //     headers: { Cookie: 'ASP.NET_SessionId=c2yjkk14nqrwslquium1hy12; __cflb=02DiuFnsSsHWYH8WqVXbZzkeTrZ6gtmGUD495Bvs4BfeC' },
        //     redirect: 'follow'
        // };

        // var getData = await fetch("https://etherscan.io/searchHandler?term=" + encodeURIComponent(searchTxt) + "&filterby=0", requestOptions)
        //     .then(response =>
        //         response.json()
        //     )
        //     .then(result => {



        //         return result;
        //     })
        //     .catch(error => console.log('error', error));

        // var finalOutput = getData
        //     .map((item) => {
        //         item = item.split("\t");
        //         let data = item[2].split("~");

        //         return {
        //             name: item[0],
        //             address: item[1],
        //             icon: item[5],
        //             contractAddres: data[0],
        //             url: data[1],
        //             price: data[3],
        //             validate: item[4] != "0"
        //         };
        //     });


        // var finalData = [];
        // for (let info of finalOutput) {
        //     var data = {};
        //     if (info.contractAddres == '') {
        //         continue;
        //     }
        //     finalData.push(info);
        // }
        // return res.status(200).json(finalData);

    } catch (err) {

        //throw error in json response with status 500. 
        return res.status(400).json(err);
    }
});

module.exports = router;