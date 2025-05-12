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


describe('authController.login', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                user_email: 'test@example.com',
                user_password: 'password123'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        process.env.JWT_SECRET = 'test-secret';
    });

    afterEach(() => {
        jest.clearAllMocks();
        delete process.env.JWT_SECRET;
    });

    test('debe retornar 401 si el usuario no existe', async () => {
        db.User.findOne.mockResolvedValue(null);

        await authController.login(req, res);

        expect(db.User.findOne).toHaveBeenCalledWith({ 
            where: { user_email: 'test@example.com' } 
        });
        expect(logger.warn).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ 
            message: 'Credenciales inválidas' 
        });
    });

    test('debe retornar 401 si la contraseña es incorrecta', async () => {
        const mockUser = {
            user_id: '1234',
            user_email: 'test@example.com',
            user_password: 'hashedPassword'
        };

        db.User.findOne.mockResolvedValue(mockUser);
        bcrypt.compareSync.mockReturnValue(false);

        await authController.login(req, res);

        expect(bcrypt.compareSync).toHaveBeenCalledWith('password123', 'hashedPassword');
        expect(logger.warn).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ 
            message: 'Credenciales inválidas' 
        });
    });

    test('debe retornar 200 y token si las credenciales son correctas', async () => {
        const mockUser = {
            user_id: '1234',
            user_name: 'Test User',
            user_email: 'test@example.com',
            user_password: 'hashedPassword',
            user_role: 'user',
            user_image: 'path/to/image.jpg'
        };

        db.User.findOne.mockResolvedValue(mockUser);
        bcrypt.compareSync.mockReturnValue(true);

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Inicio de sesión exitoso',
            token: expect.any(String),
            user: {
                user_id: mockUser.user_id,
                user_name: mockUser.user_name,
                user_email: mockUser.user_email,
                user_role: mockUser.user_role,
                user_image: mockUser.user_image
            }
        }));
        expect(logger.info).toHaveBeenCalled();
    });

    test('debe retornar 500 si ocurre un error en el servidor', async () => {
        db.User.findOne.mockRejectedValue(new Error('DB error'));

        await authController.login(req, res);

        expect(logger.error).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Error en el servidor'
        }));
    });
});
