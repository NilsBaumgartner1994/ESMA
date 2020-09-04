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
        const getMethods = (obj) => {
          let properties = new Set()
          let currentObj = obj
          do {
            Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
          } while ((currentObj = Object.getPrototypeOf(currentObj)))
          return [...properties.keys()].filter(item => typeof obj[item] === 'function')
        }
        console.log(getMethods(user));


        let result1 = await user.setDevice(model);
        console.log(result1);
        //let hasDevice = await user.hasDevice();
        //console.log("Has Device: "+hasDevice);
        //await user.addDevice(model);
        let foundDevice = await user.getDevice();
        console.log(foundDevice);
        console.log("Added a device ? : "+!!foundDevice);

        let result = await user.setDevice(null);
        console.log(result);
        foundDevice = await user.getDevice();
        console.log("Device after delete present ? : "+!!foundDevice);

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
