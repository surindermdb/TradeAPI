var express = require('express');
var bodyParser = require('body-parser');
const fetch = require('node-fetch');
var router = express.Router();
const axios = require('axios');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// RETURNS ALL THE USERS IN THE DATABASE
const bitQuery = async (req, res) => {
  try {
    const query = `
        {
            ethereum(network: bsc) {
              dexTrades(options: {limit: 30, desc: "tradeAmount"},
                exchangeName: {in: ["Pancake","Pancake v2"]}
                  smartContractAddress: 
                {in: ["0x3f3d4ce222a7c919ea7f0231471c77478e36fc0d","0xf9045866e7b372def1eff3712ce55fac1a98daf0",
                "0x1b96b92314c44b159149f7e0303511fb2fc4774f","0x9adc6fb78cefa07e13e9294f150c1e8c1dd566c0"]}) {
                
                smartContract{
                  address{
                    address
                  }
                  
                }
                date {
                  date
                }
                buyAmount
                buyAmountInUsd: buyAmount(in: USD)
                buyCurrency {
                  symbol
                  address
                }
                  sellAmountInUsd: sellAmount(in: USD)
                sellCurrency {
                  symbol
                  address
                }
                sellAmount
                sellAmountInUsd: sellAmount(in: USD)
                tradeAmount(in: USD)
                
              }
            }
          }

            `;
    const url = "https://graphql.bitquery.io/";
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "BQYGpJmxZAYOBXNDBbCiHRdlQ2pWhhD0"
      },
      body: JSON.stringify({
        query
      })
    };
    var getData = await fetch(url, opts)
      .then(response =>
        response.json()
      )
      .then(result => { return result; })
      .catch(console.error);

    return res.status(200).json(getData.data.ethereum.dexTrades);


  } catch (err) {

    return res.status(400).json(err);
  }
}


const getPoolToken = async (req, res) => {
  try {
    let address = req.query.address;
    const url = 'https://api.opencc.xyz/v1api/v2/pairs?pageNO=1&pageSize=20&sort=created_at&direction=desc&chain=&minPoolSize=250000';
    let data = await axios({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth": "58f6887c2453d4a607db4e4ebc4fdeda1653543599260736285" //"bd3240c9205c5f6b89445ece19c50af21650443369115839048"
      },
      url: url
    })

    // console.log(JSON.parse(data.data.data));

    data = JSON.parse(data.data.data);

    return res.status(200).json(data);

  } catch (err) {
    console.log('Opps! some thing went wrong. ' + err);
  }
}

const getPoolPairTOken = async (req, res) => {

  try {
    let address = req.query.address;
    const url = 'https://api.opencc.xyz/v1api/v2/tokens/'+address+'-bsc';
    let data = await axios({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth": "58f6887c2453d4a607db4e4ebc4fdeda1653543599260736285" //"bd3240c9205c5f6b89445ece19c50af21650443369115839048"
      },
      url: url
    })

    if (data.data.status == 0) {
      return res.status(200).json({ fail: true, msg: 'Contract check failed! Please try again later.' });
    }
    else {
      data = JSON.parse(data.data.data);
      return res.status(200).json(data);
    }
  } catch (err) {
    console.log('Opps! some thing went wrong. ' + err);
  }
}

const getPoolPairklive = async (req, res) => {
  try {
    let address = req.query.address;
    const url = 'https://api.opencc.xyz/v1api/v2/pairs/'+address+'-bsc/kline?interval=1440&category=u&count=800';
    let data = await axios({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth": "58f6887c2453d4a607db4e4ebc4fdeda1653543599260736285" //"bd3240c9205c5f6b89445ece19c50af21650443369115839048"
      },
      url: url
    })

    if (data.data.status == 0) {
      return res.status(200).json({ fail: true, msg: 'Contract check failed! Please try again later.' });
    }
    else {
      data = JSON.parse(data.data.data);
      return res.status(200).json(data);
    }
  } catch (err) {
    console.log('Opps! some thing went wrong. ' + err);
  }
}



module.exports = { bitQuery, getPoolToken, getPoolPairTOken,getPoolPairklive };