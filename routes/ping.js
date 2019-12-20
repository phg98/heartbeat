var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Server = require('../models/server')
require('dotenv/config')
const logger = require('../configs/winston')

let timerList = {};

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true }, 
  async ()=>{
    logger.info('Connected to DB');
    // set timers for saved items
    try{
      let activeServerList = await Server.find({currentStatus: "Up"});
      logger.info('Start watching for active servers:');
      for (server of activeServerList) {
        logger.info(server);
        var id = server.serverId;
        var timeLeft = server.latestStartTime.getTime() + server.timeout - new Date().getTime();
        timeLeft = timeLeft > 0 ? timeLeft : server.timeout;
        var newTimer = setTimeout(async function(){
          logger.info("ID:" + id + " TimeOut!");
          await Server.updateOne({serverId: id}, 
            { $set : {latestTimeoutTime: new Date(), currentStatus: "Down"}}); 
          send_notification(server)
          delete timerList[id];
        }, timeLeft);
        timerList[id] = newTimer;
        logger.info("Set timeout to timeLeft: " + timeLeft + "msec");
      }
    } catch (err) {
      res.json({message: err})
    }
  }
);

var AWS = require('aws-sdk')
AWS.config.loadFromPath('./.credentials.json');
var send_notification = server => {
  var params = {
    Message : "Heartbeat Error",
    PhoneNumber: server.phoneNumber
  }
  var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
  publishTextPromise.then(
    function(data) {
      logger.info("Message sent. ID is " + data.MessageId)
    }).catch(
      function(err) {
        logger.error(err, err.stack);
    })
}

// while developing, don't send message.
if (process.env.NODE_ENV == 'development') {
  send_notification = server => {logger.info("Heartbeat Error. Call " + server.phoneNumber)}  
}

/* GET ping from server. */
router.get('/:serverId', async function(req, res, next) {
  const id = req.params.serverId;
  logger.info("Got ping from " + id)

  // Get the server info from DB
  try{
    let foundServer = await Server.find({serverId: id});
    if (foundServer.length == 0) {
      res.json({message:"Server Not Found Error"});
      logger.error("Server Not Found Error");
      next();
    }

    await Server.updateOne({serverId: id}, 
      { $set : {latestPingTime: new Date()}});

    // if timeout exists, clear it
    let timer = timerList[id];
    if (timer !== undefined) {
      logger.info("Id:"+id+" Cleared.")
      clearTimeout(timer);
      delete timerList[id];
      const updatedServer = await Server.updateOne({serverId: id}, 
        { $set : {latestClearedTime: new Date(), currentStatus: "Up"}});
    }

    let timeout = foundServer[0].timeout || 30000;
    var newTimer = setTimeout(async function(){
      logger.info("ID:" + id + " TimeOut!");
      await Server.updateOne({serverId: id}, 
        { $set : {latestTimeoutTime: new Date(), currentStatus: "Down"}}); 
      send_notification(foundServer[0])
      delete timerList[id];
    }, timeout);
    await Server.updateOne({serverId: id}, 
      { $set : {latestStartTime: new Date(), currentStatus: "Up"}});
    timerList[id] = newTimer;
    
    res.json({message:"Got ping", id: id});
  } catch (err) {
    res.json({message: err})
  }

});

module.exports = router;
