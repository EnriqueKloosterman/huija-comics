module.exports = (sequelize, DataTypes) => {
    const alias = 'Favorites';
    // Definición de las columnas de la tabla 'favorites'
    const cols = {
        favorite_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        comic_id: {
            type: DataTypes.STRING,
            allowNull: false
        }
    };

    // Configuración del modelo
    const config = {
        tableName: 'favorites',
        paranoid: true,
        timestamps: true,
        underscored: true
    };

    // Definición del modelo 'Favorites'
    const Favorites = sequelize.define(alias, cols, config);

    // Definiciómn de las relaciones
    Favorites.associate = function(models) {
        // Asociación con el modelo 'User'
        Favorites.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'user_id'
        });
        // Asociación con el modelo 'Comic'
        Favorites.belongsTo(models.Comic, {
            as: 'comic',
            foreignKey: 'comic_id'
        });
    };
    return Favorites;
}