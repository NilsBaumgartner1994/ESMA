'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('StreamViews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      screen: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      event: {
        type: Sequelize.STRING
      },
      props: {
        type: Sequelize.JSON
      },
      eventTime: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('StreamViews');
  }
};