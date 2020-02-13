'use strict';

const faker = require('faker');
faker.locale = 'pt_BR';

module.exports = {
  up: (queryInterface, Sequelize) => {

    //gera clientes aleatórios
    let donations = [];
    for (let i = 1; i <= 15; i++) {
      donations.push(
        {
          value: faker.finance.amount(20, 100),
          observation: faker.lorem.sentence(10),
          paidIn: faker.date.between('2019-11-01', '2020-02-29'),
          TaxpayerId: Math.floor((Math.random() * 5) + 1),
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
