module.exports = (sequelize, DataTypes) => {
    const alias = 'ComicsCollection'
    const cols = {
        collection_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        collection_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        collection_description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        collection_image: {
            type: DataTypes.STRING,
            allowNull: true
        }
    };

    const config = {
        tableName: 'comic_collections',
        paranoid: true,
        timestamps: true,
        underscored: true
    };

    const ComicsCollection = sequelize.define(alias, cols, config);

    ComicsCollection.associate = models => {
        ComicsCollection.hasMany(models.Comic, {
            as: 'comics',
            foreignKey: 'id_collection'
        })
    }
    return ComicsCollection;
}