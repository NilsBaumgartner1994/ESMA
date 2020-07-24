'use strict';

var models = require('./../models');

const resourceJSONs = [{
  os: 'iPhone',
  version: "12.4",
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

    for(let i=0; i<resourceJSONs.length; i++){
      let resourceJSON = resourceJSONs[i];

      let model = await models.Device.findOne({where: resourceJSON} );
      if(model==null){
        model = models.Device.build( resourceJSON );
        await model.save();
      }

      let user = await models.User.findOne();
      if(!!user){
        await user.setDevice(model);
      }
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

    for(let i=0; i<resourceJSONs.length; i++){
      let resourceJSON = resourceJSONs[i];

      let model = await models.User.findOne({where: resourceJSON} );
      if(model==null){
        await model.delete();
      }
    }

    return
  }
};
