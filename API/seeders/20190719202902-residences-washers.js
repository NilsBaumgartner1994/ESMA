'use strict';

var models = require('./../models');

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
    let residences = await models.Residence.findAll();

    for(let i=0; i<residences.length; i++) {
      let residence = residences[i];

      let washerJSON = {
        name: "S.Bob in "+residence.title,
        status: "am blubbern",
      };
      let washer = await models.Washer.findOne({where: washerJSON} );
      if(washer==null){
        washer = models.Washer.build( washerJSON );
        washer.setResidence(residence, {save: false});
        let newWasher = await washer.save();
        await newWasher.save();
      }

      let washerEmptyJSON = {
        name: "P.Star in "+residence.title,
        status: "leer",
      };
      let washerPStar = await models.Washer.findOne({where: washerEmptyJSON} );
      if(washerPStar==null){
        washerPStar = models.Washer.build( washerEmptyJSON );
        washerPStar.setResidence(residence, {save: false});
        let newWasherPStar = await washerPStar.save();
        await newWasherPStar.save();
      }

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

    return queryInterface.bulkDelete('Washers', null, {});
  }
};
