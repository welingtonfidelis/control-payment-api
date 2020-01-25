module.exports = (sequelize, DataTypes) => {
    const LogInfo = sequelize.define('LogInfo', {
        action: DataTypes.STRING,
        UserId: DataTypes.INTEGER
    });
    LogInfo.associate = function (models) {
        LogInfo.belongsTo(models.User, {
            foreingKey: 'UserId'
        });
    }

    return LogInfo;
}