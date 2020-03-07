'use strict';

const faker = require('faker');
faker.locale = 'pt_BR';

module.exports = {
  up: (queryInterface, Sequelize) => {

    //gera clientes aleatórios
    let cashRegister = [];
    for (let i = 1; i <= 10; i++) {
      cashRegister.push(
        {
          value: faker.finance.amount(20, 100),
          observation: faker.lorem.sentence(10),
          type: faker.random.arrayElement(['in', 'out']),
          description: faker.lorem.sentence(5),
          paidIn: faker.date.between('2019-06-01', '2020-06-28'),
          UserId: Math.floor((Math.random() * 2) + 1),
          OngId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      )
    }

    return queryInterface.bulkInsert({tableName: 'CashRegisters'}, cashRegister, {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({tableName: 'CashRegisters'}, [{
    
    }]);
  }
};
