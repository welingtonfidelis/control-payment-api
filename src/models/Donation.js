module.exports = (sequelize, DataTypes) => {
    const Donation = sequelize.define('Donation', {
        value: DataTypes.REAL,
        paidIn: DataTypes.DATE,
        observation: DataTypes.STRING,
        password: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        TaxpayerId: DataTypes.INTEGER
    },
        {
            tableName: 'Donations',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            paranoid: true,
            timestamps: true,
        });
    Donation.associate = function (models) {
        Donation.belongsTo(models.Taxpayer, {
            foreingKey: 'TaxpayerId'
        });
    }

    return Donation;
}