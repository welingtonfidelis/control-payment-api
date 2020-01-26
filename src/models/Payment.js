module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        expiration: DataTypes.INTEGER,
        value: DataTypes.REAL,
    });

    return Payment;
}