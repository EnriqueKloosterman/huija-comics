const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories.controller')

router.post('/create', categoriesController.create);
router.get('/categories', categoriesController.getAllCategories);
router.get('/categories/:category_id', categoriesController.getCategoriesById);
router.put('/update/:category_id', categoriesController.updateCategory);
router.delete('/delete/:category_id', categoriesController.deleteCategory);

module.exports = router;