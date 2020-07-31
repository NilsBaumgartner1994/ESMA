'use strict';

var models = require('./../models');

const resourceJSONs = [{
  message: 'This is a message which is 50 characters looooong',
  label: "test",
}];

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
    //console.log("Okay models should now be synced");

    let user = await models.User.findOne();

    for(let i=0; i<resourceJSONs.length; i++){
      let resourceJSON = resourceJSONs[i];
      let model = models.Feedback.build( resourceJSON );
      await model.save();
      await model.setUser(user);
    }

    return;
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

    return
  }
};
