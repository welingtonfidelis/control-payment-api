'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let arrayState = [
      { name: 'Acre', code: 'AC' }, { name: 'Alagoas', code: 'AL' },
      { name: 'Amapá', code: 'AP' }, { name: 'Amazonas', code: 'AM' },
      { name: 'Bahia', code: 'BA' }, { name: 'Ceará', code: 'CE' },
      { name: 'Espírito Santo', code: 'ES' }, { name: 'Goiás', code: 'GO' },
      { name: 'Maranhão', code: 'MA' }, { name: 'Mato Grosso', code: 'MT' },
      { name: 'Mato Grosso do Sul', code: 'MS' }, { name: 'Minas Gerais', code: 'MG' },
      { name: 'Pará', code: 'PA' }, { name: 'Paraíba', code: 'PB' },
      { name: 'Paraná', code: 'PR' }, { name: 'Pernambuco', code: 'PE' },
      { name: 'Piauí', code: 'PI' }, { name: 'Rio de Janeiro', code: 'RJ' },
      { name: 'Rio Grande do Norte', code: 'RN' }, { name: 'Rio Grande do Sul', code: 'RS' },
      { name: 'Rondônia', code: 'RO' }, { name: 'Roraima', code: 'RR' },
      { name: 'Santa Catarina', code: 'SC' }, { name: 'São Paulo', code: 'SP' },
      { name: 'Sergipe', code: 'SE' }, { name: 'Tocantins', code: 'TO' },
      { name: 'Distrito Federal', code: 'DF' }
    ]

    arrayState.forEach(el => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });

    return queryInterface.bulkInsert('States', arrayState, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('States', null, {});
  }
};
