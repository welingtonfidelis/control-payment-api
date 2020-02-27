module.exports = (sequelize, DataTypes) => {
    const Ong = sequelize.define('Ong', {
        name: DataTypes.STRING,
        logo: DataTypes.STRING,
        cnpj: DataTypes.STRING,
        user: DataTypes.STRING,
        email: DataTypes.STRING,
        social1: DataTypes.STRING,
        social2: DataTypes.STRING,
        statelaw: DataTypes.STRING,
        municipallaw: DataTypes.STRING,
        deletedAt: DataTypes.DATE
    },
        {
            tableName: 'Ongs',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            deletedAt: 'deletedAt',
            paranoid: true,
            timestamps: true,
        });

    return Ong;
}