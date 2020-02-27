'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert({ tableName: 'Users' },
      [{
        name: 'Administrador',
        email: 'admteste@email.com',
        phone: '98888888',
        user: 'admteste',
        birth: '1990-07-28 00:00:00',
        password: '$2b$10$Hv6FrdPp7xRvBd02F0Skveq1A4gxtaA.Y8w0GT1WrVGh4UEn6MB5G',
        isAdm: true,
        AddressId: Math.floor(Math.random() * 5) + 1,
        OngId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Usuário',
        email: 'userteste@email.com',
        phone: '98888888',
        user: 'userteste',
        birth: '1990-07-28 00:00:00',
        password: '$2b$10$Yn7QkdDHzRVhodfGvxxe4.iHYbYyQ.nrsui5mb4HLNYGMkXZqveJi',
        isAdm: false,
        AddressId: Math.floor(Math.random() * 5) + 1,
        OngId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Administrador',
        email: 'admpatas@email.com',
        phone: '98888888',
        user: 'admpatas',
        birth: '1990-07-28 00:00:00',
        password: '$2b$10$fwHGMmA8TNv3vpg8lX9f3OkiOW7cK2zJ2gN0S2KcMVol6md.2Ndrm',
        isAdm: true,
        AddressId: Math.floor(Math.random() * 5) + 1,
        OngId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Usuário',
        email: 'userpatas@email.com',
        phone: '98888888',
        user: 'userpatas',
        birth: '1990-07-28 00:00:00',
        password: '$2b$10$lHkjpxN3ZC/NOFku5Jb9W.BepoTyvt1aYZRG5rwN/G4UVfu6QYuCS',
        isAdm: false,
        AddressId: Math.floor(Math.random() * 5) + 1,
        OngId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Administrador',
        email: 'admsos@email.com',
        phone: '98888888',
        user: 'admsos',
        birth: '1990-07-28 00:00:00',
        password: '$2b$10$wPFElQjKzAC93CvbDYKOeONp2e7izoiBffX6Y22ynElDdg2KB..A.',
        isAdm: true,
        AddressId: Math.floor(Math.random() * 5) + 1,
        OngId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Usuário',
        email: 'usersos@email.com',
        phone: '98888888',
        user: 'usersos',
        birth: '1990-07-28 00:00:00',
        password: '$2b$10$SMToPySxBvNqyGhYpVOeluTmjehuJKxI90MfsZ5ziOMEe9uBBWMtq',
        isAdm: false,
        AddressId: Math.floor(Math.random() * 5) + 1,
        OngId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({ tableName: 'Users' },
      [{
        AddressId: 1
      }])
  }
};
