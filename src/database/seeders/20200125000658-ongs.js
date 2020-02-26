'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert({tableName: 'Ongs'}, 
    [{
        name: 'Patas Amigas',
        email: 'contatopatasamigas@hotmail.com',
        logo: 'https://docs.google.com/uc?export=download&id=1OkCtfLME_XS7pnNYzhYCvwcIxIVEYSau',
        cnpj: '023.778.707/0001-29',
        statelaw: '22.321/16',
        municipallaw: '1.965/95',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'SOS Patas',
        email: 'sos@email.com',
        logo: 'https://docs.google.com/uc?export=download&id=1Jbr_aLjitHAMvqYiuyZ1AV-iFQX0URJ_',
        cnpj: '026.515.895/0001-90',
        statelaw: null,
        municipallaw: '3.486',
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
