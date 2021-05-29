const multer =require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //console.log(file)
        if(!file.originalname.match(/\.(xlsx)$/)){
            return cb(new TypeError('please upload xlsx type'));
        }
        cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
        //console.log(file)
        cb(null, file.originalname)
    }
});
 
const upload = multer({storage: storage});

module.exports = upload;