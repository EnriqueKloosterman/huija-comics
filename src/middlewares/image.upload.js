// upload images to Cloudinary
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinary/cloudinary.config');


function folderToSend(req) {
    const url = req.originalUrl;
    const path = req.route.path;

    switch(true) {
        case url.includes('/register'):
            return 'users'; 
        case url.includes('/create') && path === '/create' && req.baseUrl.includes('author'):
            return 'authors';
        case url.includes('/create') && path === '/create' && req.baseUrl.includes('comic'):
            return 'comic-pages';
        case url.includes('/create') && path === '/create' && req.baseUrl.includes('title'):
            return 'banner';
        default:
            throw new Error('No folder specified');
    }
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary, 
    params: {
        folder: (req) => folderToSend(req),
        format: async (req, file) => {
            const fileExtension = file.originalname.split('.').pop();
            if(['jpg', 'jpeg', 'png', 'gif','webp'].includes(fileExtension)) {
                return fileExtension;
            } else {
                throw new Error('Invalid file type');
            }
        },
        public_id: (req, file) => {
            const fileName = file.originalname.split('.')[0];
            return `${fileName}_${Date.now()}`;        
        }
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        const mimeTypes = ['image/jpeg',  'image.gif','image/png', 'image/webp'];
        if(mimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, GIF are allowed.'))
        }
    }
});

module.exports = upload;