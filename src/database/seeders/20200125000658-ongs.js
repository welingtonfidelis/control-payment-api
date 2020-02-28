'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert({ tableName: 'Ongs' },
      [{
        name: 'Ong de testes',
        email: 'testes@email.com',
        social1: null,
        social2: null,
        logo: 'logo.png',
        cnpj: '000.000.000/0001-00',
        statelaw: '00.000/001',
        municipallaw: '0.000/02',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Patas Amigas',
        email: 'contatopatasamigas@hotmail.com',
        social1: null,
        social2: null,
        logo: 'logo-patasamigas.png',
        cnpj: '023.778.707/0001-29',
        statelaw: '22.321/16',
        municipallaw: '1.965/95',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'SOS Patas',
        email: 'sospatas@hotmail.com',
        social1: 'www.facebook.com/ S.O.S Patas - Sociedade de proteção aos animais de Passos',
        social2: null,
        logo: 'logo-sospatas.jpg',
        cnpj: '026.515.895/0001-90',
        statelaw: null,
        municipallaw: '3.486',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({ tableName: 'Ongs' },
      [{
        AddressId: 1
      }])
  }
};
