const mongoose = require('mongoose'); 
// const Server = require('../models/server')
var Server;
try {
    Server = mongoose.model('Servers')
} catch (error) {
    Server = require('../models/server');
}
const dotenv = require('dotenv')
dotenv.config();
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
          logger.info('Connected to DB' + process.env.DB_CONNECTION);
          // set timers for saved items
          try{
            let activeServerList = await Server.find({currentStatus: "Up"});
            logger.info('Start watching for active servers:');
            for (const server of activeServerList) {
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
            return err;
          }
        }
    );
}

var AWS = require('aws-sdk')
if (process.env.NODE_ENV !== 'test') {
  AWS.config.loadFromPath('./.credentials.json');  
}
pingService.send_notification = server => {
  var messageParams = {
    Message : "Heartbeat Error on server:" + server.serverName,
    PhoneNumber: server.phoneNumber
  }
  if (process.env.NODE_ENV !== 'production') {
    // 개발모드일때는 문자메세지 보내지 않고 이메일보낸다.
    logger.info(messageParams.Message);
    logger.info("Call " + messageParams.PhoneNumber)
    if (!server.email) {
      logger.error("E-mail address not found.");
    }
    let emailParams = {
      Destination: {
        ToAddresses: [server.email],  // 받는 사람 이메일 주소
        CcAddresses: [],    // 참조
        BccAddresses: []    // 숨은 참조
      },
      Message: {
        Body: {
          Text: {
            Data: `서버(${server.serverName})에서 응답이 없습니다.`,      // 본문 내용
            Charset: "utf-8"            // 인코딩 타입
          }
        },
        Subject: {
          Data: `서버(${server.serverName})에서 응답이 없습니다.`,   // 제목 내용
          Charset: "utf-8"              // 인코딩 타입
        }
      },
      Source: "phg98@naver.com",          // 보낸 사람 주소
      ReplyToAddresses: [] // 답장 받을 이메일 주소
    }
    var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(emailParams).promise();
    sendPromise.then(
      function (data) {
        logger.info(data.MessageId);
      }).catch(
        function (err) {
          logger.info(err, err.stack);
        });

  }
  else {
    var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(messageParams).promise();
    publishTextPromise.then(
      function(data) {
        logger.info("Message sent. ID is " + data.MessageId)
      }).catch(
        function(err) {
          logger.error(err, err.stack);
      })
  }
}

pingService.handlePing = async function(id) {
    let foundServer = await Server.find({serverId: id});
    if (foundServer.length == 0) {
        logger.error("Server Not Found Error");        
        throw new Error("Server Not Found Error");
    }

    await Server.updateOne({serverId: id}, 
        { $set : {latestPingTime: new Date()}});

    // if timeout exists, clear it
    let timer = timerList[id];
    if (timer !== undefined) {
        logger.info("Id:"+id+" Cleared.")
        clearTimeout(timer);
        delete timerList[id];
        await Server.updateOne({serverId: id}, 
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

    return 'Handled';
}

module.exports = pingService