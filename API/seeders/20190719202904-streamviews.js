'use strict';

var models = require('./../models');

const resourceJSONs = [{
  screen: 'Home',
  event: "Nothing",
  props: null,
  eventTime: new Date()
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

    let device = await models.Device.findOne();

    for(let i=0; i<resourceJSONs.length; i++){
      let resourceJSON = resourceJSONs[i];
      let model = models.StreamView.build( resourceJSON );
      await model.save();
      await model.setDevice(device);
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
