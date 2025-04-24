const comicController = require("../src/controllers/comic.cotroller");
const { Comic, Author, Category, Image } = require("../src/database/models");

jest.mock("../src/database/models");

describe("comicController.create", () => {
    let req, res;

    beforeEach(() => {
    req = {
        body: {
        comic_title: "Test Comic",
        publisher_id: 1,
        collection_id: 1,
        authors: JSON.stringify([1, 2]),
        categories: JSON.stringify([3, 4]),
        },
        files: [{ path: "image1.jpg" }, { path: "image2.jpg" }],
    };

    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    Author.findAll.mockResolvedValue([{ author_id: 1 }, { author_id: 2 }]);
    Category.findAll.mockResolvedValue([
        { category_id: 3 },
        { category_id: 4 },
    ]);

    Comic.create.mockResolvedValue({
        comic_id: "mock-uuid",
        setAuthors: jest.fn(),
        setCategories: jest.fn(),
    });


    Image.bulkCreate.mockResolvedValue();
    });

    test("debería crear un cómic correctamente", async () => {
    await comicController.create(req, res);

    expect(Comic.create).toHaveBeenCalledWith(
        expect.objectContaining({
        comic_title: "Test Comic",
        publisher_id: 1,
        collection_id: 1,
        })
    );

    expect(Image.bulkCreate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
        message: "Cómic creado exitosamente",
        comic: expect.any(Object),
        }));
    });

    test("debería devolver 400 si faltan datos", async () => {
    req.body = {};
    await comicController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        error: "Faltan datos obligatorios",
        });
    });

    test("debería devolver 400 si un autor no existe", async () => {
    Author.findAll.mockResolvedValue([{ author_id: 1 }]); 
    await comicController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        error: "Algunos autores no existen en la base de datos",
    });
    });

    test("debería devolver 500 si ocurre un error inesperado", async () => {
    Comic.create.mockRejectedValue(new Error("DB error"));
    await comicController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
        });
    });
});
