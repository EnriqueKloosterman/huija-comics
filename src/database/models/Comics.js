module.exports = (sequelize, DataTypes) => {
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

    const config = {
        tableName: 'comics',
        paranoid: true,
        timestamps: true,
        underscored: true
    };

    const Comic = sequelize.define('Comic', cols, config);

    Comic.associate = models => {
        Comic.belongsToMany(models.Author, {
            as: 'authors',
            through: 'comic_authors',
            foreignKey: 'id_comic',
            otherKey: 'id_author',
            timestamps: false
        });
        Comic.hasMany(models.Image, {
            as: 'images',
            foreignKey: 'id_comic'
        });
        Comic.belongsTo(models.Publisher, {
            as: 'publisher',
            foreignKey: 'id_publisher'
        });
        Comic.belongsTo(models.ComicCollection, {
            as: 'collection',
            foreignKey: 'id_collection'
        });
    }

    return Comic;
}