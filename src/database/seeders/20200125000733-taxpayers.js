'use strict';

const faker = require('faker');
faker.locale = 'pt_BR';

module.exports = {
  up: (queryInterface, Sequelize) => {

    //gera clientes aleatórios
    let taxpayers = [];
    for (let i = 0; i < 5; i++) {
      taxpayers.push(
        {
          name: faker.name.findName(),
          email: faker.internet.email(),
          birth: faker.date.past(),
          AddressId: Math.floor(Math.random() * 5) + 1 ,
          PaymentId: Math.floor(Math.random() * 5) + 1 ,
          phone1: faker.phone.phoneNumber(),
          phone2: faker.phone.phoneNumber(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      )
    }

    return queryInterface.bulkInsert({tableName: 'Taxpayers'}, taxpayers, {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({tableName: 'Taxpayers'}, [{
      AddressId: 1
    }]);
  }
};
