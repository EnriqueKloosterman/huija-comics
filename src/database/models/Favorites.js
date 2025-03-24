module.exports = (sequelize, DataTypes) => {
    // Definición de las columnas de la tabla 'favorites'
    const cols = {
        favorite_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        id_user: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_comic: {
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
    const Favorites = sequelize.define('Favorites', cols, config);

    // Definiciómn de las relaciones
    Favorites.associate = function(models) {
        // Asociación con el modelo 'User'
        Favorites.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'id_user'
        });
        // Asociación con el modelo 'Comic'
        Favorites.belongsTo(models.Comic, {
            as: 'comic',
            foreignKey: 'id_comic'
        });
    };
    return Favorites;
}