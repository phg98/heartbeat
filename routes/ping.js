var express = require('express');
var router = express.Router();

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
    delete idList[id];
  }, timeout);
  idList[id] = newTimeoutId;

  res.json({message:"Got ping", id: id});
});

module.exports = router;
