module.exports = (sequelize, DataTypes) => {
    const alias = 'Publisher'
    const cols = {
        publisher_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        publisher_name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }

    const config = {
        tableName: 'publishers',
        paranoid: true,
        timestamps: true,
        underscored: true
    }

    const Publisher = sequelize.define(alias, cols, config)

    Publisher.associate = models => {
        Publisher.hasMany(models.Comic, {
            as: 'comics',
            foreignKey: 'id_publisher'
        });
    }
    return Publisher
}