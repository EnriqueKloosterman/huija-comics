const authController = require('../src/controllers/auth.controller');
const db = require('../src/database/models');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const logger = require('../src/utils/logger');

jest.mock('../src/database/models');
jest.mock('bcryptjs');
jest.mock('uuid');
jest.mock('../src//utils/logger');

describe('authController.register', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                user_name: 'Test User',
                user_email: 'test@example.com',
                user_password: 'password123'
            },
            file: {
                path: 'uploads/avatar.png'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('debe retornar 400 si el usuario ya existe', async () => {
        db.User.findOne.mockResolvedValue({ id: 1 }); 

        await authController.register(req, res);

        expect(db.User.findOne).toHaveBeenCalledWith({ where: { user_email: 'test@example.com' } });
        expect(logger.warn).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });

    test('debe crear usuario y retornar 201 si no existe', async () => {
        db.User.findOne.mockResolvedValue(null);
        uuidv4.mockReturnValue('1234-uuid');
        bcrypt.hashSync.mockReturnValue('hashedPassword');
        db.User.create.mockResolvedValue({});

        await authController.register(req, res);

        expect(db.User.create).toHaveBeenCalledWith({
            user_id: '1234-uuid',
            user_name: 'Test User',
            user_email: 'test@example.com',
            user_password: 'hashedPassword',
            user_image: 'uploads/avatar.png',
            user_role: 'user'
        });

        expect(logger.info).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully' });
    });

    test('debe retornar 500 si ocurre un error', async () => {
        db.User.findOne.mockRejectedValue(new Error('DB error'));

        await authController.register(req, res);

        expect(logger.error).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Error creating user'
        }));
    });
});