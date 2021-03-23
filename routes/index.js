var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });
});

router.post('/', function(req, res, next) {

  let imgData = req.body;
  if (imgData == null) {
    res.setHeader('Content-Type', 'application/json');
    res.status(403).json({error: 403, reason: 'no image data provided'});
  }else{
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(imgData));
  }
});


module.exports = router;