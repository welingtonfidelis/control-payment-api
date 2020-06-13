'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Donations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      value: {
        allowNull: false,
        type: Sequelize.REAL
      },
      paidIn: {
        allowNull: false,
        type: Sequelize.DATE
      },
      observation: {
        allowNull: true,
        type: Sequelize.STRING
      },
      TaxpayerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Taxpayers',
          key: 'id',
          onDelete: 'cascade',
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Donations');
  }
};
