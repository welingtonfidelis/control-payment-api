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
          type: Sequelize.INTEGER,
          allowNull: false
        },
        hourStart: {
          allowNull: false,
          type: Sequelize.DATE
        },
        hourEnd: {
          allowNull: false,
          type: Sequelize.DATE
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
