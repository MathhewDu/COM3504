var express = require('express');
var router = express.Router();
const tools = require('../models/tools');
// const multer = require('multer');
// const path = require('path')
//
// var storage = multer.diskStorage({
//     //set the uploaded directory
//     destination:function (req,file,cb){
//         cb(null,'../public/images')
//     },
//     //change the uploaded file name
//     filename: function (req,file,cb){
//         //get the suffix name
//         let extname = path.extname(file.originalname)
//         cb(null,Date.now()+ extname)
//     }
// })
// var upload = multer({storage:storage});

/* GET home page. */
router.get('/', function(req, res) {
    res.send("aaaa")
});
router.get('/add', function(req, res) {
    res.render("picture")
});
router.post('/doAdd',tools.multer().single("pic"), function(req, res) {
    // var body = req.body;
    res.send({
        body:req.body,
        file:req.file
    });
});
module.exports = router;
