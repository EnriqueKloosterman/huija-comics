const express = require('express');
const router = express.Router();
const upload = require('../middlewares/image.upload');
const authorController = require("../controllers/author.controller");

router.post('/create', upload.single('author_image'), authorController.create);
router.get('/authors', authorController.getAllAuthors);
router.get('/author/:author_id', authorController.getAuthorById);
router.patch('/update/:author_id', upload.single('author_image'), authorController.updateAuthor);
router.delete('/delete/:author_id', authorController.deleteAuthor);


module.exports = router;