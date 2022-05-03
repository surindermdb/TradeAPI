var express = require('express');
var bodyParser = require('body-parser');
const fetch = require('node-fetch');
const axios = require('axios');
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', async function (req, res) {

  let address = req.baseUrl.split('=')[1].toString();
  try {
    let query = `{
      ethereum(network: bsc) {
        dexTrades(
          options: {limit: 100, desc: "block.height"}
          exchangeName: {in: ["Pancake", "Pancake v2"]}
          baseCurrency: {is: "`+address+`"}
        ) {
          transaction {
            hash
          }
          smartContract {
            address {
              address
            }
            contractType
            currency {
              name
            }
          }
          tradeIndex
          date {
            date
          }
          block {
            timestamp {
              time(format: "%Y-%m-%d %H:%M:%S")
            }
            height
          }
          buyAmount
          buyAmountInUsd: buyAmount(in: USD)
          buyCurrency {
            symbol
            address
          }
          sellAmount
          sellAmountInUsd: sellAmount(in: USD)
          sellCurrency {
            symbol
            address
          }
          sellAmountInUsd: sellAmount(in: USD)
          tradeAmount(in: USD)
        }
      }
    }
    `;
    let variables = {
      "limit": 10,
      "offset": 0,
      "network": "bsc",
      "token": "0xe9e7cea3dedca5984780bafc599bd69add087d56"
    };

    const url = "https://graphql.bitquery.io/";
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "BQYXVgFy33rjBJCXSjVN6yeVcrfd5dS8"
      },
      body: JSON.stringify({
        query: query,
        variables: variables
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
});

module.exports = router;