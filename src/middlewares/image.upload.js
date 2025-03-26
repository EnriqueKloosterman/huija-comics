// upload images to Cloudinary
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinary/cloudinary.config');


function folderToSend(req) {
    const url = req.originalUrl.toLowerCase();
    const method = req.method.toUpperCase();


    if (url.includes('/author') && (method === 'POST' || method === 'PATCH')) {
        return 'authors';
    }
    if (url.includes('/auth') && (method === 'POST' || method === 'PATCH')) {
        return 'users';
    }
    if (url.includes('/comic') && method === 'POST'  || method === 'PATCH') {
        return 'comic-pages';
    }
    if (url.includes('/title') && method === 'POST'  || method === 'PATCH') {
        return 'banner';
    }
    throw new Error(`No folder specified for URL: ${url} and method: ${method}`);
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary, 
    params: {
        folder: folderToSend,
        format: async (req, file) => {
            const fileExtension = file.originalname.split('.').pop().toLowerCase();
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
