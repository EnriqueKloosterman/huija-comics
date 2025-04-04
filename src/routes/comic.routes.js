const express = require('express');
const router = express.Router();
const upload = require('../middlewares/image.upload');
const comicController = require('../controllers/comic.cotroller')

router.post('/create', upload.array('image',150), comicController.create);
router.get('/comics', comicController.getAllComics);
router.get('/comic/:comic_id', comicController.getComicById);
router.delete('/delete/:comic_id', comicController.deleteComic);

module.exports = router;