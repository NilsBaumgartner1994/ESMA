'use strict';
var models = require('./../models');
var univsersityBuildingsJSON = require('./universityVechtaBuildings.json'); //with path

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

    let universityNameJSON = {
      name: "Universität Vechta",
    };
    let uniOS = await models.University.findOne({where: universityNameJSON});
    if(uniOS!=null){

      console.log(uniOS);

      for(let i=0; i<univsersityBuildingsJSON.length; i++) {
        console.log("Progress: "+i+"/"+univsersityBuildingsJSON.length);
        let item = univsersityBuildingsJSON[i];

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
        await uniOS.addBuilding(building);

      }
      let hsBuildings =  await uniOS.getBuildings();
      console.log(universityNameJSON.name+" has now: "+hsBuildings.length+" Buildings");
    } else {
      console.log("ERROR: University: "+universityNameJSON+name+" not found !");
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
