// Controller for User actions
const db = require('../database/models');
const User = db.User
const { v4:uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

const authController = {
    register: async (req, res) => {
        const  {user_name, user_email, user_password} = req.body;
        const user_image = req.file.path;

        try {
            const userExists = await User.findOne({where: {user_email}});
        
            if(userExists) {
                logger.warn(`User already exists: ${user_email}`)
                return res.status(400).json({message: 'User already exists'});
            }
        
            await User.create({
                user_id: uuidv4(),
                user_name,
                user_email,
                user_password: bcrypt.hashSync(user_password, 10),
                user_image,
                user_role: 'user'
            });
            logger.info(`User created successfully: ${user_email}`)
            res.status(201).json({message: 'User created successfully'});
        } catch (error) {
            logger.error(`Error creating user: ${error}`)
            res.status(500).json({message: 'Error creating user', error});
        }
    }
}

module.exports = authController;