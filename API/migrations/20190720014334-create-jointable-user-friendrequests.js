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
        'UserFriendRequests',
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
          FriendId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
              references: {
                  model: "Users",
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
    return queryInterface.dropTable('UserFriendRequests');
  }
};
