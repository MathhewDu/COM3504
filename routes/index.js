var express = require('express');
var router = express.Router();
var tools =require("../models/tools")


const chat = require('../controller/ChatContrl');
const initDB= require('../controller/init');
initDB.init();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });
});
router.post('/', tools.multer().single("pic"), chat.insert,  function(req,res, next) {
  // res.render('index', { title: 'Image Browsing', success:'haaa'});
  // res.redirect('..')

});
router.get('/doAdd', function(req, res, next) {
  res.render('doadd', { title: 'Image Browsing' });
});
router.post('/doAdd', function(req,res, next) {
  // res.render('index', { title: 'Image Browsing', success:'haaa'});
  // res.render('doadd', { title: 'Image Browsing' });
  chat.insert;
  res.render('doadd', { title: 'Image Browsing' });
  // res.redirect('..')

});



module.exports = router;