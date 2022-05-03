var express = require('express');
var bodyParser = require('body-parser');
const fetch = require('node-fetch');
const axios = require('axios');
const { response } = require('../app');
var commonFunction = require('./common');
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// RETURNS ALL THE USERS IN THE DATABASE
const searchByName=async(req,res)=>{
  let searchTxt = req.baseUrl.split('=')[1].toString();

    // if(searchTxt.includes('0x')==true){
    //   let data= await commonFunction.checkIsSmartToken(searchTxt);
    //   if(data.data.ethereum.address[0].smartContract === null){
    //     console.log('null');
    //     return res.status(200).json({data:'record not found'});
    //   }
    // }

    let response = await axios.get('https://bscscan.com/searchHandler?term=' + encodeURIComponent(searchTxt) + '&filterby=0').catch((err)=>{
      console.log('i am here get Error===============after getting data')
      if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        }
      // console.log(err);
  });
     response = response.data;
     response = response
    .map((item) => {
      if(searchTxt.includes('0x')==true){
        return item;
      }
      item = item.split("\t");
      let data = item[2].split("~");
      return {
        name: item[0],
        address: item[1],
        contractAddres: data[0],
        url: data[1],
        icon : item[5], 
        price: data[3],
        validate: item[4] != "0"
      };
    });

    finalResponse = [];

    for(let item of response){
         if(item.address == '') 
         continue;
         finalResponse.push(item);
    } 

    return res.status(200).json(finalResponse);
}
// router.post('/', async function (req, res) {

//     let searchTxt = req.baseUrl.split('=')[1].toString();

//     if(searchTxt.includes('0x')==true){
//       let data= await commonFunction.checkIsSmartToken(searchTxt);
//       if(data.data.ethereum.address[0].smartContract === null){
//         console.log('null');
//         return res.status(200).json({data:'record not found'});
//       }
//     }

//     let response = await axios.get('https://bscscan.com/searchHandler?term=' + encodeURIComponent(searchTxt) + '&filterby=0');
//      response = response.data;
//      response = response
//     .map((item) => {
//       if(searchTxt.includes('0x')==true){
//         return item;
//       }
//       item = item.split("\t");
//       let data = item[2].split("~");
//       return {
//         name: item[0],
//         address: item[1],
//         contractAddres: data[0],
//         url: data[1],
//         icon : item[5], 
//         price: data[3],
//         validate: item[4] != "0"
//       };
//     });

//     finalResponse = [];

//     for(let item of response){
//          if(item.address == '') 
//          continue;
//          finalResponse.push(item);
//     } 

//     return res.status(200).json(finalResponse);
//     // try {
        
//     //     var requestOptions = {
//     //         method: 'GET'
//     //     };

//     //     var getData = await fetch("https://bscscan.com/searchHandler?term=" + encodeURIComponent(searchTxt) + "&filterby=0", requestOptions)
//     //         .then(response =>{
//     //             console.log(response.json())
//     //             // return response.json();
//     //             return res.status(200).json(response);
//     //             // response.json()
//     //         }
                
//     //         )
//     //         // .then(result => {
//     //         //     return result;
//     //         // })
//     //         .catch(error => console.log('error', error));

//     //     // var finalOutput = getData
//     //     //     .map((item) => {
//     //     //         item = item.split("\t");
//     //     //         let data = item[2].split("~");

//     //     //         return {
//     //     //             name: item[0],
//     //     //             address: item[1],
//     //     //             icon: item[5],
//     //     //             contractAddres: data[0],
//     //     //             url: data[1],
//     //     //             price: data[3],
//     //     //             validate: item[4] != "0"
//     //     //         };
//     //     //     });


//     //     // var finalData = [];
//     //     // for (let info of finalOutput) {
//     //     //     var data = {};
//     //     //     if (info.contractAddres == '') {
//     //     //         continue;
//     //     //     }
//     //     //     finalData.push(info);
//     //     // }
//     //     // return res.status(200).json(getData);

//     // } catch (err) {

//     //     //throw error in json response with status 500. 
//     //     return res.status(400).json(err);
//     // }
// });

const serachByToken = async (req,res) => {
  try {
      let address=req.query.address;
      let result= await commonFunction.checkIsSmartToken(address);
      if(result.data.ethereum.address[0].smartContract === null){
        console.log('null');
        return res.status(200).json({data:'record not found'});
      }
      const url = 'https://api.opencc.xyz/v1api/v2/tokens?keyword='+address;
      let data = await axios({
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "x-auth": "da95aabd7e0de0dd93a1ccb34a5cdaee1650975798136005951" //"bd3240c9205c5f6b89445ece19c50af21650443369115839048"
          },
          url: url
      })

      data=JSON.parse(data.data.data);
      data=data[0];
      return res.status(200).json(data);

  } catch (err) {
      console.log('Opps! some thing went wrong. ' + err);
  }
}

const tokenExtraDetail=async(req,res)=>{
  try {
    let address = req.query.address;
    const url = 'https://api.opencc.xyz/v1api/v2/tokens/'+address+'-bsc/extraDetail';
    let data = await axios({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth": "da95aabd7e0de0dd93a1ccb34a5cdaee1650975798136005951" //"bd3240c9205c5f6b89445ece19c50af21650443369115839048"
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

module.exports = {searchByName,serachByToken,tokenExtraDetail};