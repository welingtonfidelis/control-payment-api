'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Taxpayers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      birth: {
        allowNull: false,
        type: Sequelize.DATE
      },
      AddressId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Addresses',
          key: 'id',
          onDelete: 'cascade',
        }
      },
      OngId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Ongs',
          key: 'id'
        }
      },
      PaymentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Payments',
          key: 'id',
          onDelete: 'cascade',
        }
      },
      phone1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      phone2: {
        allowNull: true,
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Taxpayers');
  }
};