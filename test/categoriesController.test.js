const authorController = require('../src/controllers/author.controller');
const categoriesController = require('../src/controllers/categories.controller');
const db = require('../src/database/models');
const { v4: uuidv4 } = require('uuid');

jest.mock('../src/database/models');
jest.mock('uuid');

describe('categoriesController.create', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body:  {
                category_name: 'category name',
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('debe retornar 400 si la categoria existe', async () => {
        db.Category.findOne.mockResolvedValue({ category_id: 1});

        await categoriesController.create(req, res);
        expect(db.Category.findOne).toHaveBeenCalledWith({ where: { category_name: 'category name'}});
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Category already exists'});
    });

    it('debe crear una categoria y retornar 201 si no existe', async () => {
        db.Category.findOne.mockResolvedValue(null);
        uuidv4.mockReturnValue('1234-uuid');
        db.Category.create.mockResolvedValue({});

        await categoriesController.create(req, res);

        expect(db.Category.create).toHaveBeenCalledWith({
            category_id: '1234-uuid',
            category_name: 'category name'
        });

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Category created' });
    });

    it('debe retornar 500 si hay un error', async () => {
        db.Category.findOne.mockRejectedValue(new Error('Error'));

        await categoriesController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 
            message: 'Error checking if category exists',
            error: 'Error'
        });
    })
} );

describe('categoriesController.getAllCategories', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
        json: jest.fn()
        };
    });

    afterEach(()=> {
        jest.clearAllMocks();
    });

    test('debe retornar 200 y la lista de categorias', async () => {
        const categories = [
            {
                category_id: 'id-1234',
                category_name: 'category name'
            }
        ];
        db.Category.findAll.mockResolvedValue(categories);

        await categoriesController.getAllCategories(req, res);
        expect(db.Category.findAll).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(categories);
    });

    test('debe retornar 500 si ocurre un error', async () => {
        db.Category.findAll.mockRejectedValue(new Error('Error retrieving categories'));

        await categoriesController.getAllCategories(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error retrieving categories',
            error: 'Error retrieving categories'
        });

    } )
});

describe('categoriesController.getCategoriesById', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                category_id: '1234-id'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    });

    afterEach(() =>{
        jest.clearAllMocks();
    });

    test('debe retornar 200 y la categoria', async () => {
        const category = {
            category_id: '1234-id',
            category_name: 'category name'
        }

        db.Category.findOne.mockResolvedValue(category);

        await categoriesController.getCategoriesById(req, res);

        expect(db.Category.findOne).toHaveBeenCalledWith({ where: { 
            category_id: '1234-id'
        }});
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(category);
    });
    test('debe rertornar 404 si la categoria no existe', async () => {
        db.Category.findOne.mockResolvedValue(null);

        await categoriesController.getCategoriesById(req, res);

        expect(db.Category.findOne).toHaveBeenCalledWith({ where: {
            category_id: '1234-id'
        }});
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Category not found' });
    });
    test('dede retrornar 500 si un error', async () => {
        db.Category.findOne.mockRejectedValue(new Error('Error retrieving category'));

        await categoriesController.getCategoriesById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error retrieving category',
            error: 'Error retrieving category'
        });
    });
});

describe('categoriesController.updateCategory', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                category_id: '1',
            },
            body: {
                category_name: 'category name'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('si existe dene reternar 200 y la categoria actualizada', async () => {
        const category = {
            category_id: '1',
            category_name: 'category name'
        };

        db.Category.findOne.mockResolvedValue(category);
        db.Category.update.mockResolvedValue([1]);

        await categoriesController.updateCategory(req, res);

        expect(db.Category.findOne).toHaveBeenCalledWith({ where: {
            category_id: '1',
        }});
        expect(db.Category.update).toHaveBeenCalledWith({
            category_name: 'category name'
        }, { where: {
            category_id: '1'
        }})
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Category updated' });
    }),
    test('debe retornar 404 si la categoria no existe', async () => {
        db.Category.findOne.mockResolvedValue(null);

        await categoriesController.updateCategory(req,res);

        expect(db.Category.findOne).toHaveBeenCalledWith({
            where: {
                category_id: '1'
            }
        });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Category not found' });
    });

    test('debe retornar 500 si hay un error', async () => {
        db.Category.findOne.mockRejectedValue(new Error('Error updating category'));

        await categoriesController.updateCategory(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error updating category',
            error: 'Error updating category'
        });
    });
})

describe('categoriesController.deleteCategory', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                category_id: '1'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('debe retornar 200 si la categoria fue eliminada', async () => {
        db.Category.destroy.mockResolvedValue(1);

        await categoriesController.deleteCategory(req, res);

        expect(db.Category.destroy).toHaveBeenCalledWith({ where: {
            category_id: '1'
        }});
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Category succesfully deleted' });
    });

    test('debe retornar 404 si la categoria no existe', async () => {
        db.Category.destroy.mockResolvedValue(0);

        await categoriesController.deleteCategory(req, res);

        expect(db.Category.destroy).toHaveBeenCalledWith({ where: {
            category_id: '1'
        }});
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Category not found' });
    });

    test('debe retornar 500 si hay un error', async () => {
        db.Category.destroy.mockRejectedValue(new Error('Error deleting category'));

        await categoriesController.deleteCategory(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error deleting category',
            error: 'Error deleting category'
        });
    });
})


