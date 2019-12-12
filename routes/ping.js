var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk')
AWS.config.loadFromPath('./.credentials.json');
var send_notification = id => {
  var params = {
    Message : "Heartbeat Error",
    PhoneNumber: "+1234567890"
  }
  var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
  publishTextPromise.then(
    function(data) {
      console.log("Message ID is " + data.MessageId)
    }).catch(
      function(err) {
        console.log(err, err.stack);
    })
}

let idList = {};

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  console.log("Got ping from "+id)

  // if timeout exists, clear it
  timeoutId = idList[id];
  if (timeoutId !== undefined) {
    console.log("Id:"+id+" Cleared.")
    clearTimeout(timeoutId);
    delete idList[id];
  }

  let timeout = 10000;
  var newTimeoutId = setTimeout(function(){
    console.log("ID:" + id + " TimeOut!"); 
    send_notification(id)
    delete idList[id];
  }, timeout);
  idList[id] = newTimeoutId;

  res.json({message:"Got ping", id: id});
});

module.exports = router;
