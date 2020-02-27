'use strict';

const faker = require('faker');
faker.locale = 'pt_BR';

module.exports = {
  up: (queryInterface, Sequelize) => {

    //gera clientes aleatórios
    let payments = [];
    for (let i = 0; i < 15; i++) {
      const now = new Date();

      payments.push(
        {
          value: faker.finance.amount(20, 500),
          expiration: faker.random.number(30),
          hourStart: now,
          hourEnd: now,
          createdAt: now,
          updatedAt: now
        }
      )
    }

    return queryInterface.bulkInsert({tableName: 'Payments'}, payments, {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({tableName: 'Payments'}, [{
    
    }]);
  }
};
