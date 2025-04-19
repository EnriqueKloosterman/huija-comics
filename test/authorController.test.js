const authorController = require('../src/controllers/author.controller');
const db = require('../src/database/models');
const logger = require('../src/utils/logger');
const { v4: uuidv4 } = require('uuid');

jest.mock('../src/database/models');
jest.mock('../src/utils/logger');
jest.mock('uuid');

describe('authorController.create', () => {
    let rew, res;

    beforeEach(() => {
        req = {
            body: {
                author_name: 'Author Name',
                author_bio: 'Author Bio. It could be very long, or very short',
            },
            file: {
                path: 'path/image.png'
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

    test('debe retornar 400 si el autor existe', async () => {
        db.Author.findOne.mockResolvedValue({ id: 1 });

        await authorController.create(req, res);

        expect(db.Author.findOne).toHaveBeenCalledWith({ where: { author_name: 'Author Name'}});
        expect(logger.warn).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Author already exists' });

    });

    test('debe crear un autor y retornar 201 si no existe', async () => {
        db.Author.findOne.mockResolvedValue(null);
        uuidv4.mockReturnValue('1234-uuid');
        db.Author.create.mockResolvedValue({});

        await authorController.create(req, res);

        expect(db.Author.create).toHaveBeenCalledWith({
            author_id: '1234-uuid',
            author_name: 'Author Name',
            author_bio: 'Author Bio. It could be very long, or very short',
            author_image: 'path/image.png'
        });

        expect(logger.info).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Author created successfully' });
    });

    test('debe retornar 500 si ocurre un error', async () => {
        db.Author.findOne.mockRejectedValue(new Error('Database error'));

        await authorController.create(req, res);

        expect(logger.error).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error creating author'
        });
    })
});

describe('authorController.getAllAuthors', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('debe retornar 200 y la lista de autores', async () => {
        const authors = [
            {
                author_id: 'XXXXXXXXX',
                author_name: 'Author Name',
                author_bio: 'Author Bio. It could be very long, or very short',
                author_image: 'path/image.png'
            }
        ];

        db.Author.findAll.mockResolvedValue(authors);

        await authorController.getAllAuthors(req, res);

        expect(db.Author.findAll).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(authors);
    });

    test('debe retornar 500 si ocurre un error', async () => {
        db.Author.findAll.mockRejectedValue(new Error('Database error'));

        await authorController.getAllAuthors(req, res);

        expect(logger.error).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error retrieving authors'
        });
    });
});