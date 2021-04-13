var express = require('express');
var router = express.Router();
var tools =require("../models/tools")

var multer = require('multer')
const path = require('path')

var storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, '../public/images')
  },
  filename: function(req, file, cb){
    let extname = path.extname(file.originalname)
    cb(null,Date.now()+ extname)

  }
})
var upload = multer({storage: storage })

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
router.post('/doAdd', tools.multer().single("pic"), function(req,res, next) {
  res.render('index', { title: 'Image Browsing', success:'haaa'});
  // res.send("aaaa")
  res.send({
    body:req.body,
    file:req.file
  });
});


module.exports = router;