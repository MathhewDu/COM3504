var express = require('express');
var router = express.Router();
var tools =require("../models/tools")

var multer = require('multer')
const path = require('path')

const chat = require('../controller/ChatContrl');
const initDB= require('../controller/init');
initDB.init();

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
router.post('/', tools.multer().single("pic"), chat.insert,  function(req,res, next) {
  // res.render('index', { title: 'Image Browsing', success:'haaa'});
  res.redirect('..')

});
router.get('/doAdd', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });
});
router.post('/doAdd', tools.multer().single("pic"), chat.insert,  function(req,res, next) {
  // res.render('index', { title: 'Image Browsing', success:'haaa'});
  res.redirect('..')

});



module.exports = router;