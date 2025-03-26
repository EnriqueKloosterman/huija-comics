module.exports = (sequelize, DataTypes) => {
    
    const alias = 'Category';
    // Definición de las columnas de la tabla "Categories"
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

    // Configuración del modelo
    const config ={
        tableName: 'categories',
        paranoid: true,
        timestamps: true,
        underscored: true
    };
    
    // Definición del modelo "Category"
    const Category = sequelize.define(alias, cols, config);

    // Definición de las relaciones con otras tablas
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