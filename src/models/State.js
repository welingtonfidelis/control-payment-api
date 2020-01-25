'use strict';
module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define('State', {
    name: DataTypes.STRING,
    code: DataTypes.STRING,
  }, {});

  return State;
}