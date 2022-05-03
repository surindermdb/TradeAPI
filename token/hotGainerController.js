const cheerio = require('cheerio')
const express = require('express')
const axios = require('axios');
const fetch = require('node-fetch');
const res = require('express/lib/response');


const getHotToken = async (req,res) => {

    console.log('i am here get hot token====================')
    try {
        const url = 'https://bscscan.com/tokens?ps=100&p=1';
        const { data } = await axios({
            method: "GET",
            url: url,
        }).catch((err)=>{
            console.log('i am here get Error===============after getting data')
            if (err.response) {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
              }
            // console.log(err);
        })
        // console.log(data);

        console.log('i am here get hot token===============after getting data')
        const $ = cheerio.load(data)

        const elemSelector = 'table#tblResult tbody > tr';

        var hotTokens = [];
        var keys = [
            "serNO",
            "address",
            "tokenDetails",
            "Token",
            "Price",
            "Change",
            "Volume",
            "Circulating Market Cap ",
            "MarketCap",
            "Holders"
        ]

        let array=[];
        $(elemSelector).each((parentIndex, parentElem) => {
            let keyIdx = 0
            const coinObj = {}

            if (parentIndex <= 100) {
                var collectToken = [];
                $(parentElem).children().each((childIndex, childElem) => {
                    const tdValue = $(childElem).text();
                    const imgSrc = $(childElem).find('img.u-xs-avatar').attr('src');
                    const tokenAdrres = $(childElem).find('a.text-primary').attr('href'); 
                    const tokenSymbol = $(childElem).find('a.text-primary').text(); 


                    if (tokenAdrres) {
                        coinObj[keys[keyIdx]] = tokenAdrres ? tokenAdrres.split('/')[2] : '';
                        keyIdx++;
                    }                   
                    if (imgSrc || tokenAdrres) {
                        var tokenName = tokenSymbol.split('(');
                        coinObj[keys[keyIdx]] = {
                            'src' : imgSrc ? imgSrc : '',
                            'tokenLink' : tokenAdrres ? tokenAdrres : '',
                            'tokenAddress' : tokenAdrres ? tokenAdrres.split('/')[2] : '',
                            'tokenName' : tokenSymbol ? tokenName[0] : '',
                            'tokenSymbol' : tokenSymbol ? tokenName[1].split(')')[0] : '',
                        }
                        keyIdx++;
                    }


                    if (tdValue) {
                        coinObj[keys[keyIdx]] = tdValue;
                        keyIdx++;
                    }
                    //    collectToken.push($(childElem).text());
                })

            }
            // console.log(coinObj);
            array.push(coinObj);
        })

        return res.status(200).json(array);

    } catch (err) {
        console.log('Opps! some thing went wrong. ' + err);
    }
}

const getRecentToken = async (req,res) => {
    try {
        const url = 'https://coinmarketcap.com/new/';
        const { data } = await axios({
            method: "GET",
            url: url,
        })
        // console.log(data);

        const $ = cheerio.load(data)

        const elemSelector = 'table.h7vnx2-2.deceFm.cmc-table tbody > tr';

        var hotTokens = [];
        var keys = [
            "serNO",
            "tokenDetails",
            "Name",
            "Price",
            "1h",
            "Today",
            "Fully Diluted Market Cap",
            "Volume",
            "Blockchain",
            "Added",
        ]


        let array=[];
        $(elemSelector).each((parentIndex, parentElem) => {
            let keyIdx = 0
            const coinObj = {}

            // validate if token accociated with binace chain 
             var BNB = $(parentElem).text();

             var result = BNB.match(/BNB/g);
             if(result == null) { return; }

            if (parentIndex <= 100) {
                var collectToken = [];
                $(parentElem).children().each((childIndex, childElem) => {
                    const tdValue = $(childElem).text();
                    const imgSrc = $(childElem).find('img.coin-logo').attr('src');
                    const tokenAdrres = $(childElem).find('a.cmc-link').attr('href'); 
                                      
                    if (imgSrc && tokenAdrres) {
                        coinObj[keys[keyIdx]] = {
                            'src' : imgSrc ? imgSrc : '',
                            'link' : tokenAdrres ? tokenAdrres : '',
                        }
                        keyIdx++;
                    }

                    if (tdValue) {
                        coinObj[keys[keyIdx]] = tdValue;
                        keyIdx++;
                    }
                    //    collectToken.push($(childElem).text());
                })


            }
            // console.log(coinObj);
            array.push(coinObj);
        })

        return res.status(200).json(array);

    } catch (err) {
        console.log('Opps! some thing went wrong. ' + err);
    }
}

const getNewToken = async (req,res) => {
    try {

        const url = 'https://api.opencc.xyz/v1api/v2/tokens/new';
        let data = await axios({
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth": "da95aabd7e0de0dd93a1ccb34a5cdaee1650975798136005951" //"bd3240c9205c5f6b89445ece19c50af21650443369115839048"
            },
            url: url
        })

        // console.log(data);

        data=JSON.parse(data.data.data);

        return res.status(200).json(data);

    } catch (err) {
        console.log('Opps! some thing went wrong. ' + err);
    }
    // try {
    //     const query = `
    //     {
    //         ethereum(network: bsc) {
    //           smartContractCalls(
    //             options: {desc: "block.height", limit: 50}
    //             smartContractMethod: {is: "Contract Creation"}
    //             smartContractType: {is: Token}
    //           ) {
    //             block {
    //               height
    //               timestamp {
    //                 time
    //               }
    //             }
    //             smartContract {
    //               contractType
    //               address {
    //                 address
    //                 annotation
    //               }
    //               currency {
    //                 name
    //                 symbol
    //                 decimals
    //                 tokenType
    //               }
    //             }
    //           }
    //         }
    //       }

    //         `;
    //     const url = "https://graphql.bitquery.io/";
    //     const opts = {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "X-API-KEY": "BQYXVgFy33rjBJCXSjVN6yeVcrfd5dS8"
    //         },
    //         body: JSON.stringify({
    //             query
    //         })
    //     };
    //     var getData = await fetch(url, opts)
    //         .then(response =>
    //             response.json()
    //         )
    //         .then(result => {return result;})
    //         .catch(console.error);
        
    //     return res.status(200).json(getData);
    // }
    // catch(err){
    //     console.log('Opps! some thing went wrong. ' + err);
    // }
}


const getTokenCheckDetail = async (req,res) => {
    try {
        let address=req.query.address;
        
        const url = 'https://api.opencc.xyz/v1api/v2/tokens/contract?token_id='+address+'-bsc';
        let data = await axios({
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth": "da95aabd7e0de0dd93a1ccb34a5cdaee1650975798136005951" //"bd3240c9205c5f6b89445ece19c50af21650443369115839048"
            },
            url: url
        })

        if(data.data.status == 0){
            return res.status(200).json({fail:true, msg:'Contract check failed! Please try again later.'});
        }
        else{
            data=JSON.parse(data.data.data);
            return res.status(200).json(data);
        }

        

    } catch (err) {
        console.log('Opps! some thing went wrong. ' + err);
    }
}

module.exports={getHotToken,getTokenCheckDetail,getNewToken};