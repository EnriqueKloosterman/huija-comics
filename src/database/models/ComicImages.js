module.exports = (sequelilze, DataTypes) => {
    const cols ={
        images_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_comic: {
            type: DataTypes.STRING,
            allowNull: false
        }
    };

    const config = {
        tableName: 'images',
        paranoid: true,
        timestamps: true,
        underscored: true
    };

    const Image = sequelilze.define('Image', cols, config);

    Image.associate = models => {
        Image.belongsTo(models.Comic, {
            as: 'comic',
            foreignKey: 'id_comic'
        })
    }

    return Image;
}