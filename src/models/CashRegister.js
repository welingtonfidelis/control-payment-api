module.exports = (sequelize, DataTypes) => {
    const CashRegister = sequelize.define('CashRegister', {
        description: DataTypes.STRING,
        type: DataTypes.STRING,
        observation: DataTypes.STRING,
        value: DataTypes.REAL,
        paidIn: DataTypes.DATE,
        OngId: DataTypes.INTEGER,
        UserId: DataTypes.INTEGER,
        deletedAt: DataTypes.DATE
    },
        {
            tableName: 'CashRegisters',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            paranoid: true,
            timestamps: true,
        });
    CashRegister.associate = function (models) {
        CashRegister.belongsTo(models.Ong, {
            foreingKey: 'OngId',
            onDelete: 'cascade'
        }),
        CashRegister.belongsTo(models.User, {
            foreingKey: 'UserId'
        })
    }

    return CashRegister;
}