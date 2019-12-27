const mongoose = require('mongoose');
const Server = require('../models/server')
require('dotenv/config')
const logger = require('../configs/winston')

let timerList = {};

var pingService = {}

pingService.end = function(callback) {
  mongoose.disconnect(()=>{
    logger.info("Disconnected from DB");
    if (callback != undefined)
      callback();
  })
}

pingService.init = function(callback) {
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
                  pingService.send_notification(server)
                delete timerList[id];
              }, timeLeft);
              timerList[id] = newTimer;
              logger.info("Set timeout to timeLeft: " + timeLeft + "msec");
            }
            if (callback != undefined)
              callback();
          } catch (err) {
            res.json({message: err})
          }
        }
    );
}

var AWS = require('aws-sdk')
AWS.config.loadFromPath('./.credentials.json');
pingService.send_notification = server => {
  var params = {
    Message : "Heartbeat Error on server:" + server.serverName,
    PhoneNumber: server.phoneNumber
  }
  if (process.env.NODE_ENV !== 'production') {
    // while developing, don't send message.
    logger.info(params.Message);
    logger.info("Call " + params.PhoneNumber)
  }
  else {
    var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
    publishTextPromise.then(
      function(data) {
        logger.info("Message sent. ID is " + data.MessageId)
      }).catch(
        function(err) {
          logger.error(err, err.stack);
      })
  }
}

pingService.handlePing = async function(id, callback) {
    let foundServer = await Server.find({serverId: id});
    if (foundServer.length == 0) {
        logger.error("Server Not Found Error");
        throw new Error("Server Not Found Error");
        return;
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
        pingService.send_notification(foundServer[0])
        delete timerList[id];
    }, timeout);
    await Server.updateOne({serverId: id}, 
        { $set : {latestStartTime: new Date(), currentStatus: "Up"}});
    timerList[id] = newTimer;
    if (callback != undefined)
      callback();
}

module.exports = pingService