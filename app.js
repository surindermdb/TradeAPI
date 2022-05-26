var express = require('express');
var cors = require('cors');
var app = express();

//To allow cross-origin requests
app.use(cors({
    origin: '*'
}));

var supplyController = require('./token/supplyController');
var searchController=require('./token/searchController');
var hotGainerController=require('./token/hotGainerController');
var poolController=require('./token/poolController');
var tradeController=require('./token/tradeController');


app.use('/api/search/:term', searchController.searchByName); // Get request
app.use('/api/searchtoken/', searchController.serachByToken); // Get request
app.use('/api/tokeninfo',searchController.tokenExtraDetail); // Get request
app.use('/api/supply/',supplyController.tokenSupply); // Get request
app.use('/api/token/',supplyController.isSmartToken); // Get request
app.use('/api/gainer',hotGainerController.getHotToken); // Get request
app.use('/api/recent',hotGainerController.getNewToken); // Get request
app.use('/api/pool',poolController.bitQuery); // Get request
app.use('/api/pooltoken',poolController.getPoolToken); // Get request
app.use('/api/poolpair',poolController.getPoolPairTOken); // Get request
app.use('/api/kline',poolController.getPoolPairklive);
app.use('/api/trade/:address',tradeController); // Post request
// app.use('/api/holder/:address',supplyController.tokenHolder);
app.use('/api/check',hotGainerController.getTokenCheckDetail); // Get request
// app.use('/api/summary',searchController.tokenSummary); 

module.exports = app;