'use strict';

const faker = require('faker');
faker.locale = 'pt_BR';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let addresses = [];
    for(let i = 0; i < 5; i++){
      addresses.push({
        cep: (faker.address.zipCode()).replace('-', ''),
        state: faker.address.stateAbbr(),
        city: faker.address.city(),
        district: faker.address.streetPrefix(),
        street: faker.address.streetName(),
        complement: '',
        number: faker.random.number(500),
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    return queryInterface.bulkInsert({tableName: 'Addresses'}, addresses, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({tableName: 'Addresses'}, 
    [{
      cep: '37900316'
    }])
  }
};
