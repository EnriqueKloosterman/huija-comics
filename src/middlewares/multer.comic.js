const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinary/cloudinary.config');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'comic-pages',
        format: async (req, file) => {
            const fileExtension = file.originalname.split('.').pop();
            if(['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
                return fileExtension;
            } else {
                throw new Error('Invalid file type');
            }
        },
        public_id: (req, file) => {
            const fileName = file.originalname.split('.')[0];
            return `${fileName}_${Date.now()}`;        
        }
    },
});