const collectionController = require('../src/controllers/collections.controller');
const db = require('../src/database/models');
const { v4:uuidv4 } = require('uuid');

jest.mock('../src/database/models');
jest.mock('uuid');

describe('collectionController.create', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                collection_name: 'collection_name',
                collection_description: 'collection_description'
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

    test('si la colleción no existe debe crearla y retornar 201', async () => {
        db.ComicsCollection.findOne.mockResolvedValue(null);
        uuidv4.mockReturnValue('1');
        db.ComicsCollection.create.mockResolvedValue({});

        await collectionController.create(req, res);
        expect(db.ComicsCollection.create).toHaveBeenCalledWith({
            collection_id: '1',
            collection_name: 'collection_name',
            collection_description: 'collection_description',
            collection_image: 'path/image.png'
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Collection created successfully'
        });
    });
    test('si la colleción ya existe debe retornar 400', async () => {
        db.ComicsCollection.findOne.mockResolvedValue({ 
            collection_id: 1
        });

        await collectionController.create(req, res);
        expect(db.ComicsCollection.findOne).toHaveBeenCalledWith({
            where: {
                collection_name: 'collection_name'
            }
        });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Collection already exists'
        });
    });

    test('debe retornar 500 si hay algun error', async () => {
        db.ComicsCollection.findOne.mockRejectedValue(new Error('Error'));

        await collectionController.create(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error creating collection',
        });
    })
});

describe('cllectionController.getAllCollections', () => {
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

    test('debe retornar 200 y todas las colecciones', async () => {
        const collections = [
            {
                collection_id: '1',
                collection_name: 'collection_name',
                collection_description: 'collection_description',
                collection_image: 'path/image.png'
            },
            {
                collection_id: '2',
                collection_name: 'collection_name2',
                collection_description: 'collection_description2',
                collection_image: 'path/image2.png'
            }
        ];

        db.ComicsCollection.findAll.mockResolvedValue(collections);

        await collectionController.getAllCollections(req, res);

        expect(db.ComicsCollection.findAll).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(collections);
    });

    test('debe retornar 500 si hay algun error', async () => {
        db.ComicsCollection.findAll.mockRejectedValue(new Error('Error'));

        await collectionController.getAllCollections(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error retrieving collections',
        });
    })
});

describe('collectionController.getColectionById', () => {

    beforeEach(() => {
        req = {
            params: {
                collection_id: '1'
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

    test('si existe debe retornar 200 y la coleccion', async () => {
        const collection = {
            collection_id: '1',
            collection_name: 'collection_name',
            collection_description: 'collection_description',
            collection_image: 'path/image.png'
        };

        db.ComicsCollection.findOne.mockResolvedValue(collection);
        await collectionController.getCollectionById(req, res);
        expect(db.ComicsCollection.findOne).toHaveBeenCalledWith({
            where: {
                collection_id: '1'
            }
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(collection);
    });

    test('si no existe debe retornar 404', async () => {
        db.ComicsCollection.findOne.mockResolvedValue(null);

        await collectionController.getCollectionById(req, res);
        expect(db.ComicsCollection.findOne).toHaveBeenCalledWith({
            where: {
                collection_id: '1'
            }
        });

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Collection not found'
        });
    });

    test('debe retornar 500 si hay un error', async () => {
        db.ComicsCollection.findOne.mockRejectedValue(new Error('Error'));

        await collectionController.getCollectionById(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error retrieving collection',
        });
    });
});

describe('collctionCOntroller.upadateCollection', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                collection_id: '1'
            },
            body: {
                collection_name: 'collection_name',
                collection_description: 'collection_description'
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

    test('si la coleccion existe debe actualizarla y retornar 200', async () => {
        const collection = {
            collection_id: '1',
            collection_name: 'collection_name',
            collection_description: 'collection_description',
            collection_image: 'path/image.png'
        };

        db.ComicsCollection.findOne.mockResolvedValue(collection);
        db.ComicsCollection.update.mockResolvedValue([1]);

        await collectionController.updateCollection(req, res);
        expect(db.ComicsCollection.update).toHaveBeenCalledWith({
            collection_name: 'collection_name',
            collection_description: 'collection_description',
            collection_image: 'path/image.png'
        }, {
            where: {
                collection_id: '1'
            }
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Collection updated successfully'
        });
    });

    test('si la coleccion no existe debe retornar 404', async () => {
        db.ComicsCollection.findOne.mockResolvedValue(null);

        await collectionController.updateCollection(req, res);
        expect(db.ComicsCollection.findOne).toHaveBeenCalledWith({
            where: {
                collection_id: '1'
            }
        });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Collection not found'
        });
    });

    test('debe retornar 500 si hay un error', async () => {
        db.ComicsCollection.findOne.mockRejectedValue(new Error('Error'));

        await collectionController.updateCollection(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error updating collection',
        });
    });
});

describe('collectionController.deleteCollction', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                collection_id: '1'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        db.ComicsCollection.destroy = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('si la coleccion existe debe eliminarla y retornar 200', async () => {

        await collectionController.deleteCollection(req, res);

        expect(db.ComicsCollection.destroy).toHaveBeenCalledWith({
            where: {
                collection_id: '1'
            }
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Collection deleted successfully'
        });
    });

    test('si la coleccion no existe debe retornar 404', async () => {
        db.ComicsCollection.destroy.mockResolvedValue(0);

        await collectionController.deleteCollection(req, res);

        expect(db.ComicsCollection.destroy).toHaveBeenCalledWith({
            where: {
                collection_id: '1'
            }
        });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Collection not found or already deleted'
        });
    });

    test('debe retornar 500 si hay un error', async () => {
        db.ComicsCollection.destroy.mockRejectedValue(new Error('Error'));

        await collectionController.deleteCollection(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error deleting collection',
        });
    });
})