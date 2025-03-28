// Controller for Categories actions
const db = require('../database/models')
const Category = db.Category;
const { v4:uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { log } = require('winston');

const categoriesController = {
    // Creates a new Category
    create: async (req, res) => {
        const { category_name } = req.body;

        try {
            const categoryExists = await Category.findOne({ where: { category_name }});
            if(categoryExists){
                logger.warn(`Category ${category_name} already exists`);
                return res.status(400).json({ message: 'Category already exists' });
            }
            await Category.create({
                category_id: uuidv4(),
                category_name
            });
            logger.info(`Category ${category_name} created`);
            return res.status(201).json({ message: 'Category created' });
        } catch (error) {
            logger.error(`Error checking if category exists: ${error.message}`);
            return res.status(500).json({ message: 'Error checking if category exists', error: error.message });
        }
    },
    // Get all categories
    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.findAll();
            logger.info(`Categories retrieved: ${categories.length}`);
            return res.status(200).json(categories);
        } catch (error) {
            logger.error(`Error retrieving categories: ${error.message}`);
            return res.status(500).json({ message: 'Error retrieving categories', error: error.message });
        }
    },
    // Get a cetegory by id
    getCategoriesById: async (req, res) => {
        const { category_id } = req.params;
        try {
            const category = await Category.findOne({ where: { category_id }}); 
            if (!category) {
                logger.warn(`Category ${category_id} not found`);
                return res.status(404).json({ message: 'Category not found' });
            }
            logger.info(`Category ${category_id} retrieved`);
            return res.status(200).json(category);
        } catch (error) {
            logger.error(`Error retrieving category: ${error.message}`);
            return res.status(500).json({ message: 'Error retrieving category', error: error.message });
        }
    },
    // Updates a category
    updateCategory: async  (req, res) => {
        const { category_id } = req.params;
        const { category_name } = req.body;
        try {
            const category = await Category.findOne({ where: { category_id }});
            if (!category) {
                logger.warn(`Category ${category_id} not found`);
                return res.status(404).json({ message: 'Category not found' });
            }
            await Category.update({ category_name }, { where: { category_id }});
            logger.info(`Category ${category_id} updated`);
            return res.status(200).json({ message: 'Category updated' });
        } catch (error) {
            logger.error(`Error updating category: ${error.message}`);
            return res.status(500).json({ message: 'Error updating category', error: error.message });
        }
    },
    //Deletes a category
    deleteCategory: async (req, res) => {
        const { category_id } = req.params;
        try {
            const result = await Category.destroy({ 
                where: { category_id }
            });
            if (result === 0) {
                logger.warn(`Category ${category_id} not found`);
                return res.status(404).json({ message: 'Category not found' });
            }
            logger.info(`Category ${category_id} succesfully deleted`);
            return res.status(200).json({ message: 'Category succesfully deleted' });
        } catch (error) {
            logger.error(`Error deleting category: ${error.message}`);
            return res.status(500).json({ message: 'Error deleting category', error: error.message });
        }
    }
}


module.exports = categoriesController;