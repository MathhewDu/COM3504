var chatModel = require('../models/chat');

exports.insert = function (req, res) {
    let userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        let chat = new chatModel({
            ImageTitle:userData.title,
            Description:userData.description,
            Author:userData.author,
            Url: "null"
        });
        console.log('receivedhhhh: ' + chat);

        chat.save(function (err) {
            // console.log(results._id);
            if (err){
                res.status(500).send('Invalid data!');
            }
            console.log("shuju zengjia chenggong");

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(chat))
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}