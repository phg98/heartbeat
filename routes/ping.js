var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  console.log("Got ping from "+id)
  res.json({message:"Got ping", id: id});
});

module.exports = router;
