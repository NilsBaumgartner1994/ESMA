'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return queryInterface.createTable(
        'UserRoles',
        {
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: new Date()
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: new Date()
          },
          beginnAt: {
            type: Sequelize.DATE,
            defaultValue: new Date()
          },
          endAt: {
            type: Sequelize.DATE,
            defaultValue: null
          },
          UserId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
              references: {
                  model: "Users",
                  key: "id",
              },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          RoleId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
              references: {
                  model: "Roles",
                  key: "id",
              },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
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
    return queryInterface.dropTable('UserRoles');
  }
};
