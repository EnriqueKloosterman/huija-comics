// Controller for  Comic Collection actions
const db = require('../database/models');
const ComicsCollection = db.ComicsCollection;
const { v4:uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const collectionController = {
    // Creates a new collection
    create: async (req, res) => {
        const { collection_name, collection_description } = req.body
        const collection_image = req.file.path

        try {
            const collectionExists = await ComicsCollection.findOne({ where: { collection_name: collection_name } })

            if (collectionExists) {
                logger.warn(`Collection with name ${collection_name} already exists`)
                return res.status(400).json({ message: 'Collection already exists' })
            }
            await ComicsCollection.create({
                collection_id: uuidv4(),
                collection_name,
                collection_description,
                collection_image
            });
            logger.info(`Collection ${collection_name} created successfully`)
            return res.status(201).json({ message: 'Collection created successfully' })
        } catch (error) {
            logger.error(`Error creating collection: ${error}`)
            return res.status(500).json({ message: 'Error creating collection' })
        }
    },
    // Gets all collections
    getAllCollections: async (req, res) => {
        try {
            const collections = await ComicsCollection.findAll();
            logger.info(`Collections retrieved successfully`)
            return res.status(200).json(collections)
        } catch (error) {
            logger.error(`Error retrieving collections: ${error}`)
            return res.status(500).json({ message: 'Error retrieving collections' })
        }
    },
    // Gets a collection id
    getCollectionById: async (req, res) => {
        const { collection_id } = req.params
        const { collecton_name } = db.ComicsCollection;
        try {
            const collection = await ComicsCollection.findOne({ where: { collection_id: collection_id } });
            if (!collection) {
                logger.warn(`Collection with id ${collection_id} not found`)
                return res.status(404).json({ message: 'Collection not found' })
            };
            logger.info(`Collection ${collecton_name} retrieved successfully`)
            return res.status(200).json(collection)
        } catch (error) {
            logger.error(`Error retrieving collection: ${error}`)
            return res.status(500).json({ message: 'Error retrieving collection' })
        }
    },
    //TODO: modificar el Update para que lea la imagen del body y no solo del file.path
    // Update a collection
    updateCollection: async (req, res) => {
        const { collection_id } = req.params
        const { collection_name, collection_description } = req.body
        const collection_image = req.file.path
        try {
            const collection = await ComicsCollection.findOne({ where: { collection_id }});
            if (!collection) {
                logger.warn(`Collection with id ${collection_id} not found`)
                return res.status(404).json({ message: 'Collection not found' })
            };
            await ComicsCollection.update({
                collection_name,
                collection_description,
                collection_image
            }, { where: { collection_id } });
            logger.info(`Collection ${collection_name} updated successfully`)
            return res.status(200).json({ message: 'Collection updated successfully' })

        } catch (error) {
            logger.error(`Error updating collection: ${error}`);
            return res.status(500).json({ message: 'Error updating collection' })
        }
    },
    // Soft deletes a collection
    deleteCollection: async (req, res) => {
        const { collection_id } = req.params
        try {
            const result = await ComicsCollection.destroy({ where: { collection_id } });
            if (result === 0) {
                logger.warn(`Collection with id ${collection_id} not found`);
                return res.status(404).json({ message: 'Collection not found or already deleted' });
            };
            logger.info(`Collection with id ${collection_id} deleted successfully`);
            return res.status(200).json({ message: 'Collection deleted successfully' });
        } catch (error) {
            logger.error(`Error deleting collection: ${error}`);
            return res.status(500).json({ message: 'Error deleting collection' });
        }
    }

}

module.exports = collectionController;