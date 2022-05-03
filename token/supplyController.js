var express = require('express');
var bodyParser = require('body-parser');
const fetch = require('node-fetch');
var router = express.Router();
var commonFunction = require('./common');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const tokenHolder= async(req,res)=>{
    let address=req.baseUrl.split('=')[1].toString();
    console.log('i am here ');
    console.log(address);
    try {
        var requestOptions = {
            method: 'GET',
            headers: { Cookie: 'ASP.NET_SessionId=c2yjkk14nqrwslquium1hy12; __cflb=02DiuFnsSsHWYH8WqVXbZzkeTrZ6gtmGUD495Bvs4BfeC' },
            redirect: 'follow'
        };

        var getData = await fetch("https://api.bscscan.com/api?module=token&action=tokenholderlist&contractaddress="+address+"&page=1&offset=10&apikey=YJN5Z3X6E2JFEXSZQJPQEKUVH8XIZNW57Z", requestOptions)
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
}

const tokenSupply=async(req,res)=>{
    let address=req.query.address;
    try {
        var requestOptions = {
            method: 'GET',
            headers: { Cookie: 'ASP.NET_SessionId=c2yjkk14nqrwslquium1hy12; __cflb=02DiuFnsSsHWYH8WqVXbZzkeTrZ6gtmGUD495Bvs4BfeC' },
            redirect: 'follow'
        };
    
        var getData = await fetch("https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress="+address+"&apikey=YJN5Z3X6E2JFEXSZQJPQEKUVH8XIZNW57Z", requestOptions)
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
}

const isSmartToken= async (req,res)=>{

    console.log(req.query.address);
    let data=await commonFunction.checkIsSmartToken(req.query.address);
    console.log(data);
    return res.status(200).json(data);
    try {

        // console.log(req.query.address);
        let query=`{
            ethereum(network: bsc) {
              address(address: {is: "`+req.query.address+`"}) {
                smartContract {
                currency {
                    symbol
                    name
                    decimals
                    tokenType
                  }
                }
              }
            }
          }`;

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

        console.log(getData);   
        return res.status(200).json(getData); 

    } catch (err) {
        console.error(err)
    }
}

module.exports = {tokenHolder,tokenSupply,isSmartToken};