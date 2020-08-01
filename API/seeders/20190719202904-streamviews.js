'use strict';

var models = require('./../models');

const resourceJSONs = [{
  screen: 'Home',
  event: "Clicked",
  props: {
    fakeProps: {
      payed: true,
      name: "Rick Astley",
      age: 42
    },
    more: true,
    time: new Date(),
    world: "Earth"
  },
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
