module.exports =(sequelize, DataTypes) => {
    const cols = {
        author_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        author_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author_bio: {
            type: DataTypes.STRING,
            allowNull: true
        },
        author_image: {
            type: DataTypes.STRING,
            allowNull: true
        },
    };

    const config = {
        tableName: 'authors',
        paranoid: true,
        timestamps: true,
        underscored: true
    };

    const Author = sequelize.define('Author', cols, config);

    Author.associate = models => {
        Author.belongsToMany(models.Comic, {
            as: 'comics',
            through: 'comic_authors',
            foreignKey: 'id_author',
            otherKey: 'id_comic',
            timestamps: false
        })
    }
    return Author;
}