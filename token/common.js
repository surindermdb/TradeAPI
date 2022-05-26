const fetch = require('node-fetch');

const checkIsSmartToken = async (address)=>{

    try {

        let query=`{
            ethereum(network: bsc) {
              address(address: {is: "`+address+`"}) {
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
            .then(result => {return result;})
            .catch(console.error);

        return getData

    } catch (err) {
        console.error(err)
    }
}

module.exports={checkIsSmartToken};