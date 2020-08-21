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
    const servers = await Server.find();
    res.json(servers);
  }catch(err){
    res.json({message: err});
  }
});

/* Get user */
router.get('/:serverName', async function(req, res, next) {
  logger.info(req.params.serverName);
  try{
    const foundServer = await Server.find({serverName: req.params.serverName});
    res.json(foundServer);
  } catch (err) {
    res.json({message: err})
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
    const savedServer = await server.save();
    logger.info("Saved server : "+JSON.stringify(savedServer))
    res.json(savedServer);
  } catch (err) {
    logger.error("Saved server error: "+JSON.stringify(err))
    res.json({message: err})
  }
});

/* DELETE user */
router.delete('/:serverName', async function(req, res, next) {
  logger.info(req.params.serverName);
  try{
    const removedServer = await Server.deleteOne({serverName: req.params.serverName});
    res.json(removedServer);
  } catch (err) {
    res.json({message: err})
  }
});

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
