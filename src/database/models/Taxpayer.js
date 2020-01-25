module.exports = (sequelize, DataTypes) => {
    const Taxpayer = sequelize.define('Taxpayer', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        phone1: DataTypes.STRING,
        phone2: DataTypes.STRING,
        birth: DataTypes.DATE,
        AddressId: DataTypes.INTEGER,
        PaymentId: DataTypes.INTEGER,
        deletedAt: DataTypes.DATE
    },
        {
            tableName: 'Taxpayers',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            paranoid: true,
            timestamps: true,
        });
    Taxpayer.associate = function (models) {
        Taxpayer.belongsTo(models.Address, {
            foreingKey: 'AddressId',
            onDelete: 'cascade'
        }),
            Taxpayer.belongsTo(models.Payment, {
                foreingKey: 'PaymentId',
                onDelete: 'cascade'
            })
    }

    return User;
}