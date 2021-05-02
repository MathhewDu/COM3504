var express = require('express');
var router = express.Router();
var tools =require("../models/tools")
var fs = require('fs')

const chat = require('../controller/ChatContrl');
const initDB= require('../controller/init');
initDB.init();

var multer = require('multer')
const path = require('path')

// var storage = multer.diskStorage({
//     destination: function (req, file, cb){
//         cb(null, '../public/images')
//     },
//     filename: function(req, file, cb){
//         let extname = path.extname(file.originalname)
//         cb(null,Date.now()+ extname)
//
//     }
// })
// var upload = multer({storage: storage })


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('uploadimg.ejs')
});

// router.post('/', tools.multer().single("pic"),  function(req,res, next) {
//     console.log(req.file)
//     let fullname = "/images/"+ req.file.filename
//     console.log(""+fullname+"")
//     res.send("<h1>shangchuan chenggong</h1><img src='"+fullname+"'>")
// });
// chat.insert,
router.post('/', tools.multer().single("pic"),  function(req,res, next) {
    console.log(req.file)
    // chat.insert
    let fullname = "/images/"+ req.file.filename
    console.log(""+fullname+"")
    res.json({
        state: 'ok',
        imgUrl: fullname
    })
});
// router.post('/doAdd', chat.insert,  function(req,res, next) {
//     // res.render('index', { title: 'Image Browsing', success:'haaa'});
//     res.send("<h1>success</h1>")
// });
router.get('/ajax', function (req,res){
    res.render('uploadimgAjax.ejs')
})
module.exports = router;
