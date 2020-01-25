module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('Address', {
        cep: DataTypes.STRING,
        state: DataTypes.STRING,
        city: DataTypes.STRING,
        district: DataTypes.STRING,
        street: DataTypes.STRING,
        complement: DataTypes.STRING,
        number: DataTypes.INTEGER
    });

    return Address;
}