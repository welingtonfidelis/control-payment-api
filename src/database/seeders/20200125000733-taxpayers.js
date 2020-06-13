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
          name: faker.name.findName() + ' TESTE',
          email: faker.internet.email(),
          birth: faker.date.past(),
          AddressId: Math.floor(Math.random() * 5) + 1 ,
          PaymentId: i + 1 ,
          OngId: 1,
          phone1: (faker.phone.phoneNumber()).replace(/\D/g, ''),
          phone2: (faker.phone.phoneNumber()).replace(/\D/g, ''),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      )
    };
    for (let i = 5; i < 10; i++) {
      taxpayers.push(
        {
          name: faker.name.findName() + ' PATAS',
          email: faker.internet.email(),
          birth: faker.date.past(),
          AddressId: Math.floor(Math.random() * 5) + 1 ,
          PaymentId: i + 1 ,
          OngId: 2 ,
          phone1: (faker.phone.phoneNumber()).replace(/\D/g, ''),
          phone2: (faker.phone.phoneNumber()).replace(/\D/g, ''),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      )
    };
    for (let i = 10; i < 15; i++) {
      taxpayers.push(
        {
          name: faker.name.findName() + ' SOS',
          email: faker.internet.email(),
          birth: faker.date.past(),
          AddressId: Math.floor(Math.random() * 5) + 1 ,
          PaymentId: i + 1 ,
          OngId: 3,
          phone1: (faker.phone.phoneNumber()).replace(/\D/g, ''),
          phone2: (faker.phone.phoneNumber()).replace(/\D/g, ''),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      )
    };

    return queryInterface.bulkInsert({tableName: 'Taxpayers'}, taxpayers, {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({tableName: 'Taxpayers'}, [{
      AddressId: 1
    }]);
  }
};
