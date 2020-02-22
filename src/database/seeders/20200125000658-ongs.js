'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert({tableName: 'Ongs'}, 
    [{
        name: 'patas amigas',
        email: 'patas@email.com',
        logo: 'https://docs.google.com/uc?export=download&id=1OkCtfLME_XS7pnNYzhYCvwcIxIVEYSau',
        cnpj: '000.000.000/0001-00',
        statelaw: '1.000/00',
        municipallaw: '1.000/00',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'sos patas',
        email: 'sos@email.com',
        logo: 'https://docs.google.com/uc?export=download&id=1Jbr_aLjitHAMvqYiuyZ1AV-iFQX0URJ_',
        cnpj: '000.000.000/0002-00',
        statelaw: '2.000/00',
        municipallaw: '2.000/00',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete({tableName: 'Ongs'}, 
    [{
      AddressId: 1
    }])
  }
};
