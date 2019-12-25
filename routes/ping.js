var express = require('express');
var router = express.Router();
const pingService = require("../services/pingService")
const logger = require('../configs/winston')

/* GET ping from server. */
router.get('/:serverId', async function(req, res, next) {
  const id = req.params.serverId;
  logger.info("Got ping from " + id)

  try{
    await pingService.handlePing(id);    
    res.json({message:"Got ping", id: id});
  } catch (err) {
    res.json({message: err})
  }

});

module.exports = router;
