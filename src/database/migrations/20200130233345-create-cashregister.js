'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CashRegisters', {
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
      registerIn: {
        allowNull: false,
        type: Sequelize.DATE
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      observation: {
        allowNull: true,
        type: Sequelize.STRING
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      OngId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Ongs',
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
    return queryInterface.dropTable('CashRegisters');
  }
};
