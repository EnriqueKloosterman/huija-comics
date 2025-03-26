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
        },   
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
            foreignKey: 'id_comic',
            otherKey: 'id_author',
            timestamps: false
        });
        Comic.belongsToMany(models.Category, {
            as: 'categories',
            through: 'comic_categories',
            foreignKey: 'id_comic',
            otherKey: 'id_category',
            timestamps: false
        })
        Comic.hasMany(models.Image, {
            as: 'images',
            foreignKey: 'id_comic'
        });
        Comic.belongsTo(models.Publisher, {
            as: 'publisher',
            foreignKey: 'id_publisher'
        });
        Comic.belongsTo(models.ComicsCollection, {
            as: 'comic_collections',
            foreignKey: 'id_collection'
        });
        Comic.hasMany(models.Comments, {
            as: 'comments',
            foreignKey: 'id_comic'
        }),
        Comic.hasMany(models.Likes, {
            as: 'likes',
            foreignKey: 'id_comic'
        }),
        Comic.hasMany(models.Favorites, {
            as: 'favorites',
            foreignKey: 'id_comic'
        })
    };
    return Comic;
}