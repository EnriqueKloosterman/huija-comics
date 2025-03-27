const express = require('express');
const router = express.Router();
const publisherController = require('../controllers/publishers.controller');

router.post('/create', publisherController.create);
router.get('/publishers', publisherController.getAllPublishers);
router.get('/publishers/:publisher_id', publisherController.getPublisherById);
router.put('/update/:publisher_id', publisherController.updatePublisher);
router.delete('/delete/:publisher_id', publisherController.deletePublisher);


module.exports = router;

