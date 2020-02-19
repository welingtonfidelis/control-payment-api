'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert({tableName: 'Users'}, 
    [{
        name: 'Administrador',
        email: 'adm@email.com',
        phone: '98888888',
        user: 'adm',
        birth: '1990-07-28 00:00:00',
        password: '$2b$10$6db/DiUiPrL6umMQ6K3A4.7LYLtmQnhVqt/jzrsQRYNEOqcPhdDj6',
        isAdm: true,
        AddressId: Math.floor(Math.random() * 5) + 1 ,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Usuário',
        email: 'user@email.com',
        phone: '98888888',
        user: 'user',
        birth: '1990-07-28 00:00:00',
        password: '$2b$10$byUa1WlhUA9f0wSoiS/chefu3mmJomh/pLq24g.8u3EHRtIMjYiGC',
        isAdm: false,
        AddressId: Math.floor(Math.random() * 5) + 1 ,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({tableName: 'Users'}, 
    [{
      AddressId: 1
    }])
  }
};
