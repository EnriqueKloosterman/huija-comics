// Controller for  Publisher actions
const db = require('../database/models');
const Publisher = db.Publisher;
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const publisherController = {
    // Creates a new publisher
    create: async (req, res) => {
        const { publisher_name } = req.body;

        try {
            const publisherExists = await Publisher.findOne({ where: { publisher_name } });
            if (publisherExists) {
                logger.warn(`Publisher with name ${publisher_name} already exists`);
                return res.status(400).json({ message: 'Publisher already exists' });
            };
            await Publisher.create({
                publisher_id: uuidv4(),
                publisher_name
            });
            logger.info(`Publisher ${publisher_name} created successfully`);
            return res.status(201).json({ message: 'Publisher created successfully' });
        } catch (error) {
            logger.error(`Error creating publisher: ${error.message}`);
            res.status(500).json({ message: 'Error creating publisher', error: error.message });
        }
    },
    // gets all publishers
    getAllPublishers: async (req, res) => {
        try {
            const publishers = await Publisher.findAll();
            logger.info(`Retrieved all publishers successfully`);
            return res.status(200).json({ publishers });
        } catch (error) {
            logger.error(`Error retrieving publishers: ${error.message}`);
            res.status(500).json({ message: 'Error retrieving publishers', error: error.message });
        }
    },
    // Get a publisher by it's id
    getPublisherById: async (req, res) =>  {
        const { publisher_id } = req.params;
        try {
            const publisher = await Publisher.findOne({ where: { publisher_id } });
            if(!publisher) {
                logger.warn(`Publisher with id ${publisher_id} not found`);
                return res.status(404).json({ message: 'Publisher not found' });
            }
            logger.info(`Retrieved publisher with id ${publisher_id} successfully`);
            return res.status(200).json({ publisher });
        } catch (error) {
            logger.error(`Error retrieving publisher: ${error.message}`);
            res.status(500).json({ message: 'Error retrieving publisher', error: error.message });
        }
    },
    // Updates publisher data
    updatePublisher: async (req, res) => {
        const { publisher_id } = req.params;
        const { publisher_name } = req.body;
        try {
            const publisher = await Publisher.findOne({ where: { publisher_id } });
            if(!publisher) {
                logger.warn(`Publisher with id ${publisher_id} not found`);
                return res.status(404).json({ message: 'Publisher not found' });
            }
            await Publisher.update({ publisher_name }, { where: { publisher_id } });
            logger.info(`Publisher with id ${publisher_id} updated successfully`);
            return res.status(200).json({ message: 'Publisher updated successfully' });
        } catch (error) {
            logger.error(`Error updating publisher: ${error.message}`);
            res.status(500).json({ message: 'Error updating publisher', error: error.message });
        }
    },
    // Soft deletes a publisher by it's id
    deletePublisher: async (req, res) => {
        const { publisher_id } = req.params;
        try {
            const result = await Publisher.destroy({
                where: { publisher_id }
            })
            if (result === 0) {
                logger.warn(`Publisher with id ${publisher_id} not found`);
                return res.status(404).json({ message: 'Publisher not found' });
            }
            logger.info(`Publisher with id ${publisher_id} deleted successfully`);
            return res.status(200).json({ message: 'Publisher deleted successfully' });
        } catch (error) {
            logger.error(`Error deleting publisher: ${error.message}`);
            res.status(500).json({ message: 'Error deleting publisher', error: error.message });
        }
    }

}

module.exports = publisherController;