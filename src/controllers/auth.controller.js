// Controller for User actions
const db = require('../database/models');
const User = db.User
const { v4:uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');

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
    },

    login: async (req, res) => {
        const { user_email, user_password } = req.body;

        try {
            const user = await User.findOne({ where: { user_email } });
            if (!user) {
                logger.warn(`Intento de inicio de sesión fallido: usuario no encontrado - ${user_email}`);
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            const isValidPassword = bcrypt.compareSync(user_password, user.user_password);

            if (!isValidPassword) {
                logger.warn(`Intento de inicio de sesión fallido: contraseña incorrecta - ${user_email}`);
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            const token = jwt.sign(
                { 
                    user_id: user.user_id,
                    user_email: user.user_email,
                    user_role: user.user_role 
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            logger.info(`Usuario conectado exitosamente: ${user_email}`);
            res.status(200).json({
                message: 'Inicio de sesión exitoso',
                token,
                user: {
                    user_id: user.user_id,
                    user_name: user.user_name,
                    user_email: user.user_email,
                    user_role: user.user_role,
                    user_image: user.user_image
                }
            });
        } catch (error) {
            logger.error(`Error en el inicio de sesión: ${error}`);
            res.status(500).json({ message: 'Error en el servidor', error });
        }
    },
    // Update user
    updateUser: async (req, res) => {
        const { user_id } = req.params;
        const { user_name, user_email, user_image: existinImage} = req.body;

        try {
            const user = await User.findByPk(user_id);

            if (!user) {
                logger.warn(`Usuario no encontrado: ${user_id}`);
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            const updateData = {
                user_name,
                user_email,
                user_image: existinImage
            };
            if(req.file) {
                updateData.user_image = req.file.path;
            };
            await User.update(updateData, { where: { user_id } });            logger.info(`Usuario actualizado exitosamente: ${user_id}`);
            res.status(200).json({ message: 'Usuario actualizado exitosamente' });
        } catch (error) {
            logger.error(`Error al actualizar el usuario: ${error}`);
            res.status(500).json({ message: 'Error al actualizar el usuario', error });
        }
    },
}

module.exports = authController;