// Users model

module.exports = (sequelize, DataTypes) => {
    const alias = 'User';
    const cols = {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        user_password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        user_role: {
            type: DataTypes.STRING,
            allowNull: false
        },
    };

    const config = {
        tableName: 'users',
        paranoid: true,
        underscored: true,
        timestamps: true
    };

    const User = sequelize.define(alias, cols, config);

    User.associate = models => {
        User.hasMany(models.Like, {
            as: 'likes',
            foreignKey: 'id_user'
        });
        User.hasMany(models.Comment, {
            as: 'comments',
            foreignKey: 'id_user'
        });
        User.hasMany(models.Favorite, {
            as: 'favorites',
            foreignKey: 'id_user'
        });
    }
    return User;
}