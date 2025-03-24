module.exports = (sequelize, DataTypes) => {
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
        pararnoid: true,
        timestamps: true,
        underscored: true
    }

    const Publisher = sequelize.define('Publisher', cols, config)

    Publisher.associate = models => {
        Publisher.hasMany(models.Comic, {
            as: 'comics',
            foreignKey: 'id_publisher'
        });
    }
    return Publisher
}