module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        user: DataTypes.STRING,
        birth: DataTypes.DATE,
        password: DataTypes.STRING,
        isAdm: DataTypes.BOOLEAN,
        AddressId: DataTypes.INTEGER,
        deletedAt: DataTypes.DATE
    },
        {
            tableName: 'Users',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            paranoid: true,
            timestamps: true,
        });
    User.associate = function (models) {
        User.belongsTo(models.Address, {
            foreingKey: 'AddressId',
            onDelete: 'cascade'
        }),
            User.hasMany(models.LogInfo, {
                foreingKey: 'UserId'
            })
    }

    return User;
}