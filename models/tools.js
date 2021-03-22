const multer = require('multer');
const path = require('path')

let tools = {
    multer() {
        var storage = multer.diskStorage({
            //set the uploaded directory
            destination: function (req, file, cb) {
                cb(null, '../public/images')
            },
            //change the uploaded file name
            filename: function (req, file, cb) {
                //get the suffix name
                let extname = path.extname(file.originalname)
                cb(null, Date.now() + extname)
            }
        })
        var upload = multer({storage: storage});
        return upload;
    }
}

module.exports = tools