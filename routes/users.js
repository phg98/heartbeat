/* eslint-disable no-unused-vars */
var express = require('express');
var router = express.Router();
const logger = require('../configs/winston')
const uuid = require('../utils/uuid')

// const Server = require('../models/server');
var Server;
try {
    var mongoose = require('mongoose');
    Server = mongoose.model('Servers')
} catch (error) {
    Server = require('../models/server');
}

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    logger.info('GET users');
    const servers = await Server.find();
    
    logger.info(`users found, ${servers}`);
    res.json(servers);
  }catch(err){
    logger.error('GET users failed');
    res.json({message: err});
  }
});

/* Get user */
router.get('/:serverName', async function(req, res, next) {
  logger.info(req.params.serverName);
  try{
    const foundServer = await Server.find({serverName: req.params.serverName});
    if (foundServer.length) {
      logger.info('Found server : ' + foundServer);
      res.json(foundServer);
    } else {
      logger.error('Can NOT find server : ' + req.params.serverName);
      res.json(foundServer);
    }
  } catch (err) {
    logger.error('GET user failed for ' + req.params.serverName);
    res.status(404).json({message: err});
  }
});

/* POST user */
router.post('/', async function(req, res, next) {
  logger.info("Add server : " + JSON.stringify(req.body));
  var server = new Server({
    //serverId: req.body.serverId,
    serverId: uuid(),
    serverName: req.body.serverName,
    timeout: req.body.timeout,
    phoneNumber: req.body.phoneNumber,
    isTemp: req.body.isTemp,
    email: req.body.email,
  })
  try{
    // 서버이름이 이미 존재하면 에러처리한다.
    const foundServer = await Server.find({serverName: server.serverName});
    logger.info(foundServer);
    if (foundServer.length) {
      let err = 'Server name already taken : ' + server.serverName
      logger.error(err);
      res.status(409).json({message: err});
      return;
    }
    const savedServer = await server.save();
    logger.info("Saved server : "+JSON.stringify(savedServer))
    res.json(savedServer);
  } catch (err) {
    logger.error("Saved server error: "+JSON.stringify(err))
    res.json({message: err})
  }
});


if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  logger.info('enable DELETE on development mode.')
  /* DELETE user */
  router.delete('/:serverName', async function (req, res, next) {
    logger.info(req.params.serverName);
    try {
      const removedServer = await Server.deleteOne({ serverName: req.params.serverName });
      res.json(removedServer);
    } catch (err) {
      res.json({ message: err })
    }
  });
} 


/* UPDATE user */
// router.patch('/:serverId', async function(req, res, next) {
//   logger.info(req.params.serverId);
//   try{
//     const updatedServer = await Server.updateOne({serverId: req.params.serverId}, 
//       { $set : req.body});
//     res.json(updatedServer);
//   } catch (err) {
//     res.json({message: err})
//   }
// });

module.exports = router;
