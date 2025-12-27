const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB limit
    }
});

module.exports = upload;
