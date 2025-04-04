module.exports = (sequelize, DataTypes) => {
    const alias = 'Image';
    const cols ={
        image_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        comic_id: {
            type: DataTypes.STRING,
            allowNull: false
        }
    };

    const config = {
        tableName: 'comic_images',

        timestamps: false,
        underscored: true
    };

    const Image = sequelize.define(alias,cols, config);

    Image.associate = models => {
        Image.belongsTo(models.Comic, {
            as: 'comic',
            foreignKey: 'comic_id'
        })
    }

    return Image;
}