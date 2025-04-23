const authorController = require('../src/controllers/author.controller');
const db = require('../src/database/models');
const logger = require('../src/utils/logger');
const { v4: uuidv4 } = require('uuid');

jest.mock('../src/database/models');
jest.mock('../src/utils/logger');
jest.mock('uuid');

describe('authorController.create', () => {
    let req, res;

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

    it('debe retornar 400 si el autor existe', async () => {
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
                author_id: '1',
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

describe('authorController.getAuthorById', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                author_id: '1'
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

    test('debe retornar 200 y el autor si existe', async () => {
        const author = {
            author_id: '1',
            author_name: 'Author Name',
            author_bio: 'Author Bio. It could be very long, or very short',
            author_image: 'path/image.png'
        };

        db.Author.findOne.mockResolvedValue(author);

        await authorController.getAuthorById(req, res);

        expect(db.Author.findOne).toHaveBeenCalledWith({ where: { author_id: '1' }});
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(author);
    });

    test('debe retornar 404 si el autor no existe', async () => {
        db.Author.findOne.mockResolvedValue(null);

        await authorController.getAuthorById(req, res);

        expect(db.Author.findOne).toHaveBeenCalledWith({ where: { author_id: '1' }});
        expect(logger.warn).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Author not found' });
    });

    test('debe retornar 500 si ocurre un error', async () => {
        db.Author.findOne.mockRejectedValue(new Error('Database error'));

        await authorController.getAuthorById(req, res);

        expect(logger.error).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error retrieving author'
        });
    });
})

describe('authorController.updateAuthor', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                author_id: '1'
            },
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

    test('debe retornar 200 y el autor actualizado si existe', async () => {
        const author = {
            author_id: '1',
            author_name: 'Author Name',
            author_bio: 'Author Bio. It could be very long, or very short',
            author_image: 'path/image.png'
        };

        db.Author.findOne.mockResolvedValue(author);
        db.Author.update.mockResolvedValue([1]);

        await authorController.updateAuthor(req, res);

        expect(db.Author.findOne).toHaveBeenCalledWith({ where: { author_id: '1' }});
        expect(db.Author.update).toHaveBeenCalledWith({
            author_name: 'Author Name',
            author_bio: 'Author Bio. It could be very long, or very short',
            author_image: 'path/image.png'
        }, { where: { author_id: '1' }});
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Author updated successfully' });
    });

    test('debe retornar 404 si el autor no existe', async () => {
        db.Author.findOne.mockResolvedValue(null);

        await authorController.updateAuthor(req, res);

        expect(db.Author.findOne).toHaveBeenCalledWith({ where: { author_id: '1' }});
        expect(logger.warn).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Author not found' });
    });

    test('debe retornar 500 si ocurre un error', async () => {
        db.Author.findOne.mockRejectedValue(new Error('Database error'));

        await authorController.updateAuthor(req, res);

        expect(logger.error).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error updating author'
        });
    });
});

describe('authorController.deleteAuthor', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                author_id: '1'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        db.Author.destroy = jest.fn();
        logger.warn = jest.fn();
        logger.info = jest.fn();
        logger.error = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('debe retornar 200 si el autor fue eliminado', async () => {
        db.Author.destroy.mockResolvedValue(1);

        await authorController.deleteAuthor(req, res);

        expect(db.Author.destroy).toHaveBeenCalledWith({ where: { author_id: '1' }});
        expect(logger.info).toHaveBeenCalledWith('Author with id 1 soft-deleted successfully');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Author soft-deleted successfully' });
    });

    test('debe retornar 404 si el autor no existe', async () => {
        db.Author.destroy.mockResolvedValue(0);

        await authorController.deleteAuthor(req, res);

        expect(db.Author.destroy).toHaveBeenCalledWith({ where: { author_id: '1' }});
        expect(logger.warn).toHaveBeenCalledWith('Author with id 1 not found or already deleted');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Author not found or already deleted' });
    });

    test('debe retornar 500 si ocurre un error', async () => {
        db.Author.destroy.mockRejectedValue(new Error('Database error'));

        await authorController.deleteAuthor(req, res);

        expect(logger.error).toHaveBeenCalledWith('Error deleting author: Database error');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error deleting author',
            error: 'Database error'
        });
    });
});