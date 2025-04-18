const {
  Comic,
  Author,
  Publisher,
  Category,
  Image,
  ComicsCollection,
} = require("../database/models");
const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");

const comicController = {
  create: async (req, res) => {
    try {
      const { comic_title, publisher_id, collection_id, authors, categories } =
        req.body;

      if (!comic_title || !publisher_id || !collection_id) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
      }

      const authorIds =
        typeof authors === "string" ? JSON.parse(authors) : authors;
      const categoryIds =
        typeof categories === "string" ? JSON.parse(categories) : categories;

      const foundAuthors = await Author.findAll({
        where: { author_id: authorIds },
      });
      const foundCategories = await Category.findAll({
        where: { category_id: categoryIds },
      });

      if (foundAuthors.length !== authorIds.length) {
        return res
          .status(400)
          .json({ error: "Algunos autores no existen en la base de datos" });
      }
      if (foundCategories.length !== categoryIds.length) {
        return res
          .status(400)
          .json({ error: "Algunas categorías no existen en la base de datos" });
      }

      //  Crea el cómic en la tabla 'comics'
      const newComic = await Comic.create({
        comic_id: uuidv4(),
        comic_title,
        publisher_id,
        collection_id,
      });
      logger.info("Comic created successfully in the database.");

      // Guarda las imágenes en la tabla 'comic_images'
      if (req.files && req.files.length > 0) {
        const imageRecords = req.files.map((file) => ({
          image_id: uuidv4(),
          comic_id: newComic.comic_id,
          image: file.path,
        }));

        await Image.bulkCreate(imageRecords);
        logger.info("Images stored successfully in the database.");
      }

      // Asociar autores y categorías
      await newComic.setAuthors(foundAuthors);
      await newComic.setCategories(foundCategories);

      logger.info("Authors and categories associated successfully.");
      return res.status(201).json({
        message: "Cómic creado exitosamente",
        comic: newComic,
      });
    } catch (error) {
      logger.error("Error al crear el cómic:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  },
  // Trae todos los comics con sus asociaciones
  getAllComics: async (req, res) => {
    try {
      const comics = await Comic.findAll({
        include: [
          {
            model: Publisher,
            as: "publisher",
            attributes: ["publisher_id", "publisher_name"],
          },
          {
            model: ComicsCollection,
            as: "comic_collections",
            attributes: ["collection_id", "collection_name"],
          },
          {
            model: Author,
            as: "authors",
            attributes: ["author_id", "author_name"],
          },
          {
            model: Category,
            as: "categories",
            attributes: ["category_id", "category_name"],
          },
          {
            model: Image,
            as: "comic_images",
            attributes: ["image_id", "image"],
          },
        ],
      });
      logger.info("Comics found successfully in the database.");
      return res.status(200).json(comics);
    } catch (error) {
      logger.error("Error obtaining comics:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  // Trae un comic por su ID 
  getComicById: async (req, res) => {
    try {
      const { comic_id } = req.params;

      const comic = await Comic.findOne({
        where: { comic_id: comic_id },
        include: [
          {
            model: Publisher,
            as: "publisher",
            attributes: ["publisher_id", "publisher_name"],
          },
          {
            model: ComicsCollection,
            as: "comic_collections",
            attributes: ["collection_id", "collection_name"],
          },
          {
            model: Author,
            as: "authors",
            attributes: ["author_id", "author_name"],
          },
          {
            model: Category,
            as: "categories",
            attributes: ["category_id", "category_name"],
          },
          {
            model: Image,
            as: "comic_images",
            attributes: ["image_id", "image"],
          },
        ],
      });

      if (!comic) {
        logger.warn("Comic not found in the database.");
        return res.status(404).json({ message: "Cómic no encontrado" });
      }
      logger.info("Comic found successfully in the database.");
      return res.status(200).json(comic);
    } catch (error) {
      logger.error("Error obtaining comic:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  // Hace un soft delete del comic por su id
  deleteComic: async (req, res) => {
    const { comic_id } = req.params;

    try{
      const result = await Comic.destroy({
        where: { comic_id },
      });
      if(!result === 0) {
        logger.warn('Comic not found.')
        return res.satuts(404).json({ message: 'Error deleting comic', error: error.message})
      }
      logger.info('Comic deleted successfully.')
      return res.status(200).json({ message: 'Comic deleted successfully.'})
    } catch {
      logger.error(`Error deleting comic: ${error.message}`);
      return res.status(500).json({ message: 'Error deleting comic', error: error.message}) 
    }
  }
};
module.exports = comicController;
