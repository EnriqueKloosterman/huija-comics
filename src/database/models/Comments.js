module.exports = (sequelize, DataTypes) => {
    const alias = 'Comments';
    // Definición de las columnas de la tabla 'comments'
    const cols= {
        comment_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        comment_text: {
            type: DataTypes.STRING,
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
    // Configuración de del modelo
    const config = {
        tableName: 'comments',
        paranoid: true,
        timestamps: true,
        underscored: true
    };
    // Definición del modelo 'Comments'
    const Comments = sequelize.define(alias, cols, config);

    // Definición de las rerlaciones
    Comments.associate = function(models){
        Comments.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'user_id'
        });
        Comments.belongsTo(models.Comic, {
            as: 'comic',
            foreignKey: 'comic_id'
        });
    };

    return Comments;
}