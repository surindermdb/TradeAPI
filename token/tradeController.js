var express = require('express');
var bodyParser = require('body-parser');
const fetch = require('node-fetch');
const axios = require('axios');
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());



// RETURNS ALL THE USERS IN THE DATABASE

// const tradeTransaction = async (req, res) => {
//   try {
//     let address = req.query.address;
//     console.log('iam here',address);
//     const url = 'https://api.opencc.xyz/v1api/v2/pairs/'+address+'-bsc/txs';
//     console.log(url);
//     let data = await axios({
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "x-auth": "da95aabd7e0de0dd93a1ccb34a5cdaee1650975798136005951" //"bd3240c9205c5f6b89445ece19c50af21650443369115839048"
//       },
//       url: url
//     })

//     console.log(data.data);

//     data = JSON.parse(data.data.data);
//     return res.status(200).json(data);

//   } catch (err) {
//     console.log('Opps! some thing went wrong. ' + err);
//   }
// }

// router.post('/', async function (req, res) {

//   let address = req.baseUrl.split('=')[1].toString();
//   try {
//     let query = `query ($network: EthereumNetwork!, $token: String!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
//                 ethereum(network: $network) {
//                   dexTrades(
//                     options: {desc: ["block.height", "tradeIndex"], limit: $limit, offset: $offset}
//                     date: {since: $from, till: $till}
//                     baseCurrency: {is: $token}
//                   ) {
//                     block {
//                       timestamp {
//                         time(format: "%Y-%m-%d %H:%M:%S")
//                       }
//                       height
//                     }
//                     taker{
//                       address
//                     }
//                     tradeIndex
//                     quotePrice
//                     sellAmountInUSD: sellAmount(in: USD)
//                     buyAmountInUSD: buyAmount(in: USD)
//                     protocol
//                     exchange {
//                       fullName
//                     }
//                     smartContract {
//                       address {
//                         address
//                         annotation
//                       }
//                     }
//                     baseAmount
//                     baseCurrency {
//                       address
//                       symbol
//                     }
//                     quoteAmount
//                     quoteCurrency {
//                       address
//                       symbol
//                     }
//                     transaction {
//                       hash
//                     }
//                   }
//                 }
//               }`;
//     let variables = {
//       "limit": 100,
//       "offset": 0,
//       "network": "bsc", //ethereum
//       "token": address,
//       "from": "2022-04-01",
//       "till": null,
//       "dateFormat": "%Y-%m-%d"
//     };

//     const url = "https://graphql.bitquery.io/";
//     const opts = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-API-KEY": "BQYXVgFy33rjBJCXSjVN6yeVcrfd5dS8"
//       },
//       body: JSON.stringify({
//         query: query,
//         variables: variables
//       })
//     };
//     var getData = await fetch(url, opts)
//       .then(response =>
//         response.json()
//       )
//       .then(result => { return result; })
//       .catch(console.error);

//     return res.status(200).json(getData.data.ethereum.dexTrades);

//   } catch (err) {

//     return res.status(400).json(err);
//   }
// });

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