module.exports = (sequelize, DataTypes) => {
    const LogError = sequelize.define('LogError', {
        action: DataTypes.STRING,
        error: DataTypes.STRING,
        UserId: DataTypes.INTEGER
    });
    LogError.associate = function (models) {
        LogError.belongsTo(models.User, {
            foreingKey: 'UserId'
        });
    }

    return LogError;
}