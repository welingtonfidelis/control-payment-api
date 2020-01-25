module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        expiration: DataTypes.INTEGER,
        value: DataTypes.REAL,
    },
        {
            tableName: 'Payments',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            paranoid: true,
            timestamps: true,
        });

    return Payment;
}