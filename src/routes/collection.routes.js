const express = require('express');
const router = express.Router();
const upload = require('../middlewares/image.upload');
const collectionController = require('../controllers/collections.controller')

router.post('/create', upload.single('collection_image'), collectionController.create)
router.get('/collections', collectionController.getAllCollections);
router.get('/collection/:collection_id', collectionController.getCollectionById);
router.patch('/update/:collection_id', upload.single('collection_image'), collectionController.updateCollection);
router.delete('/delete/:collection_id', collectionController.deleteCollection);

module.exports = router;