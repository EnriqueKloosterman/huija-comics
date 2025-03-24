module.exports = (sequelize, DataTypes) => {
    const cols = {
        category_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        category_name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    };

    const config ={
        tableName: 'categories',
        paranoid: true,
        timestamps: true,
        underscored: true
    };
    
    const Category = sequelize.define('Category', cols, config);

    Category.associate = models => {
        Category.belongsToMany(models.Comic, {
            as: 'comics',
            through: 'comic_categories',
            foreignKey: 'id_category',
            otherKey: 'id_comic',
            timestamps: false
        })
    }
    return Category;
}