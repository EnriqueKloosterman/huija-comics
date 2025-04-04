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
        User.hasMany(models.Likes, {
            as: 'likes',
            foreignKey: 'user_id'
        });
        User.hasMany(models.Comments, {
            as: 'comments',
            foreignKey: 'user_id'
        });
        User.hasMany(models.Favorites, {
            as: 'favorites',
            foreignKey: 'user_id'
        });
    }
    return User;
}