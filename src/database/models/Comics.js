module.exports = (sequelize, DataTypes) => {
    const alias = 'Comic'
    // Definción de las columnas de la tabla 'comics'
    const cols = {
        comic_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        comic_title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }

    // COnfiguración del modelo
    const config = {
        tableName: 'comics',
        paranoid: true,
        timestamps: true,
        underscored: true
    };

    //Definición del modelo 'Comic'
    const Comic = sequelize.define(alias, cols, config);
    
    // Definición de las relaciones con otras tablas
    Comic.associate = models => {
        Comic.belongsToMany(models.Author, {
            as: 'authors',
            through: 'comic_authors',
            foreignKey: 'comic_id',
            otherKey: 'author_id',
            timestamps: false
        });
        Comic.belongsToMany(models.Category, {
            as: 'categories',
            through: 'comic_categories',
            foreignKey: 'comic_id',
            otherKey: 'category_id',
            timestamps: false
        })
        Comic.hasMany(models.Image, {
            as: 'comic_images',
            foreignKey: 'comic_id'
        });
        Comic.belongsTo(models.Publisher, {
            as: 'publisher',
            foreignKey: 'publisher_id'
        });
        Comic.belongsTo(models.ComicsCollection, {
            as: 'comic_collections',
            foreignKey: 'collection_id'
        });
        Comic.hasMany(models.Comments, {
            as: 'comments',
            foreignKey: 'comic_id'
        }),
        Comic.hasMany(models.Likes, {
            as: 'likes',
            foreignKey: 'comic_id'
        }),
        Comic.hasMany(models.Favorites, {
            as: 'favorites',
            foreignKey: 'comic_id'
        })
    };
    return Comic;
}