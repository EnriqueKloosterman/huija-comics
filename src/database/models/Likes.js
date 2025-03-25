module.exports = (sequelize, DataTypes) =>  {
    const alias = 'Likes';
    // Definición de las columnas de la tabla 'likes'
    const cols = {
        like_id: {
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

    //Configuración del modelo
    const config = {
        tableName: 'likes',
        paranoid: true,
        timestamps: true,
        underscored: true
    };

    //Definición del modelo 'Likes'
    const Likes = sequelize.define(alias, cols, config);

    // Definición de las relaciones
    Likes.associate = function(models) {
        Likes.belongsTo(models.User, {
            as: 'users',
            foreignKey: 'id_user'
        });
        Likes.belongsTo(models.Comic, {
            as: 'comic',
            foreignKey: 'id_comic'
        });
    };

    return Likes
}