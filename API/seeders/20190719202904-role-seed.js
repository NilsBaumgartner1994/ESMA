'use strict';
var models = require('./../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    let modelSync = await models.sequelize.sync();

    await models.Role.findOrCreate({where: {name: 'guest'}});
    await models.Role.findOrCreate({where: {name: 'user'}});
    await models.Role.findOrCreate({where: {name: 'moderator'}});
    await models.Role.findOrCreate({where: {name: 'admin'}});
    await models.Role.findOrCreate({where: {name: 'owner'}});

    return;

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

    return queryInterface.bulkDelete('Roles', null, {});
  }
};
