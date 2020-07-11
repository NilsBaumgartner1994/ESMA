'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return queryInterface.addColumn(
        'StreamViews',
        'DeviceId',
        {
          type:Sequelize.INTEGER,
          references: {
            model: "Devices",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        }
    );

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    return queryInterface.removeColumn(
        "StreamViews",
        "DeviceId"
    );
  }
};
