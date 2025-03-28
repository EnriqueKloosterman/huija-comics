// COntroller for Author actions
const db  = require('../database/models');
const Author = db.Author;
const { v4:uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const authorController = {
    //Crea un nuevo author
    create: async (req, res) => {
        const { author_name, author_bio } = req.body;
        const author_image = req.file.path;

        try{
            const authorExists = await Author.findOne({ where: {author_name}});

            if(authorExists) {
                logger.warn(`Author with name ${author_name} already exists`);
                return res.status(400).json({message: 'Author already exists'});
            }

            await Author.create({
                author_id: uuidv4(),
                author_name,
                author_bio,
                author_image
            });
            logger.info(`Author with name ${author_name} created successfully`);
            return res.status(201).json({message: 'Author created successfully'});
        } catch (error) {
            logger.error(`Error creating author: ${error.message}`);
            res.status(500).json({message: 'Error creating author'});
        }
    },
    // Trae todos los autores
    getAllAuthors: async (req, res) => {
        try{
            const authors = await Author.findAll();
            logger.info(`Authors retrieved successfully`);
            res.status(200).json(authors);
        } catch (error) {
            logger.error(`Error retrieving authors: ${error.message}`);
            res.status(500).json({message: 'Error retrieving authors'});
        }
    },
    // Trae au un autor por su id
    getAuthorById: async (req, res) => {
        const { author_id } = req.params;
        try{
            const author = await Author.findOne({ where: {author_id}});
            if(!author) {
                logger.warn(`Author with id ${author_id} not found`);
                return res.status(404).json({message: 'Author not found'});
            }
            logger.info(`Author with id ${author_id} retrieved successfully`);
            res.status(200).json(author);
        } catch (error) {
            logger.error(`Error retrieving author: ${error.message}`);
            res.status(500).json({message: 'Error retrieving author'});
        }
    },
    //Modifica los datos del autor
    updateAuthor: async (req, res) => {
        const { author_id } = req.params;
        const { author_name, author_bio } = req.body;
        const author_image = req.file.path;
        try{
            const author = await Author.findOne({ where: {author_id}});
            if(!author) {
                logger.warn(`Author with id ${author_id} not found`);
                return res.status(404).json({message: 'Author not found'});
            }
            await Author.update({
                author_name,
                author_bio,
                author_image
            }, { where: {author_id}});
            logger.info(`Author with id ${author_id} updated successfully`);
            res.status(200).json({message: 'Author updated successfully'});
        } catch (error) {
            logger.error(`Error updating author: ${error.message}`);
            res.status(500).json({message: 'Error updating author'});
        }
    },
    // Hace un soft delete por medio del id
    deleteAuthor: async (req, res) => {
        const { author_id } = req.params;
        
        try {
            const result = await Author.destroy({ 
                where: { author_id },
            });
    
            if (result === 0) {
                logger.warn(`Author with id ${author_id} not found or already deleted`);
                return res.status(404).json({ message: 'Author not found or already deleted' });
            }
    
            logger.info(`Author with id ${author_id} soft-deleted successfully`);
            res.status(200).json({ message: 'Author soft-deleted successfully' });
            
        } catch (error) {
            logger.error(`Error deleting author: ${error.message}`);
            res.status(500).json({ message: 'Error deleting author', error: error.message });
        }
    }
};


module.exports = authorController;
