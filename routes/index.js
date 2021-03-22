var express = require('express');
var router = express.Router();
const tools = require('../models/tools');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });
});
router.post('/doAdd',tools.multer().single("pic"), function(req, res) {
  // var body = req.body;
  res.render('index', { title: 'images uploaded successfully,please connect room'});
  // res.send({
  //   body:req.body,
  //   file:req.file
  // });
  // alert("image uploaded successfully")
});

module.exports = router;
