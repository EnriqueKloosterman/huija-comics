module.exports = (sequelize, DataTypes) =>  {
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
    const Likes = sequelize.define('Likes', cols, config);

    // Definición de las relaciones
    Likes.associate = function(models) {
        Likes.belongsTo(models.Users, {
            as: 'user',
            foreignKey: 'id_user'
        });
        Likes.belongsTo(models.Comics, {
            as: 'comic',
            foreignKey: 'id_comic'
        });
    };

    return Likes
}