'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('Payments', { 
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false 
        },
        value: {
          type: Sequelize.REAL,
          allowNull: false
        },
        expiration: {
          type: Sequelize.INTEGER(2),
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
      });
 
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('Payments');
  }
};
