'use strict';

const faker = require('faker');
faker.locale = 'pt_BR';

module.exports = {
  up: (queryInterface, Sequelize) => {

    //gera clientes aleatórios
    let donations = [];
    for (let i = 1; i <= 2; i++) {
      donations.push(
        {
          value: faker.finance.amount(20, 100),
          observation: faker.lorem.text(),
          paidIn: new Date(),
          TaxpayerId: i,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      )
    }

    return queryInterface.bulkInsert({tableName: 'Donations'}, donations, {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({tableName: 'Donations'}, [{
    
    }]);
  }
};
