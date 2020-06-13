module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        expiration: DataTypes.INTEGER,
        hourStart: DataTypes.DATE,
        hourEnd: DataTypes.DATE,
        value: DataTypes.REAL,
    });

    return Payment;
}