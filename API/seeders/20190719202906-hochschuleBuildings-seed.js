'use strict';
var models = require('./../models');
var hochschuleBuildingsJSON = require('./hochschuleBuildings.json'); //with path

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

    ;

    let universityHsOsJSON = {
      name: "Hochschule Osnabrück",
    };
    let universityHsOs = await models.University.findOne({where: universityHsOsJSON});
    if(universityHsOs!=null){

      console.log(universityHsOs);

      for(let i=0; i<hochschuleBuildingsJSON.length; i++) {
        console.log("Progress: "+i+"/"+hochschuleBuildingsJSON.length);
        let item = hochschuleBuildingsJSON[i];

        //Find or Create an Building
        let buildingJSON = {
          short: item["short"],
          name: item["name"],
          latitude: parseFloat(item["latitude"]),
          longitude: parseFloat(item["longitude"]),
        };
        let building = await models.Building.findOne({where: {short: buildingJSON["short"]}});
        if (building == null) {
          building = models.Building.build(buildingJSON);
        }
        await building.save();
        await universityHsOs.addBuilding(building);

      }
      let hsBuildings =  await universityHsOs.getBuildings();
      console.log(universityHsOsJSON.name+" has now: "+hsBuildings.length+" Buildings");
    } else {
      console.log("ERROR: University: "+universityHsOsJSON+name+" not found !");
    }

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
