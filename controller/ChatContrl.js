var chatModel = require('../models/chat');
var user = new chatModel({
    name:"lisi",
    room:"1",
    URL:"12"
})

user.save(function (err){
    if(err){
        console.log(err);
        return;
    }
    console.log("shuju zengjia chenggong");
})
chatModel.find({},function (err,doc){
    if(err){
        console.log(err);
        return;
    }
    console.log(doc);
})