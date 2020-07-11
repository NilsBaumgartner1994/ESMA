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

    /**
     * Uni Osnabrück
     */
    let addressUniOsJSON = {
      street: 'Neuer Graben',
      number: "",
      city: "Osnabrück",
      zip: 49076,
      country: "Germany"
    };
    let addressUniOs = await models.Address.findOne({where: addressUniOsJSON} );
    if(addressUniOs==null){
      addressUniOs = models.Address.build( addressUniOsJSON );
      await addressUniOs.save();
    }

    let universityUniOsJSON = {
      name: "Universität Osnabrück",
    };
    let universityUniOs = await models.University.findOne({where: universityUniOsJSON});
    if(universityUniOs==null){
      universityUniOs = models.University.build( universityUniOsJSON );
    }
    universityUniOs.setAddress(addressUniOs, {save: false});
    await universityUniOs.save();

    /**
     * Uni Vechta
     */

    let addressUniVecJSON = {
      street: 'Driverstraße',
      number: "22",
      city: "Vechta",
      zip: 49377,
      country: "Germany"
    };
    let addressUniVec = await models.Address.findOne({where: addressUniVecJSON} );
    if(addressUniVec==null){
      addressUniVec = models.Address.build( addressUniVecJSON );
      await addressUniVec.save();
    }

    let universityUniVecJSON = {
      name: "Universität Vechta",
    };
    let universityUniVec = await models.University.findOne({where: universityUniVecJSON});
    if(universityUniVec==null){
      universityUniVec = models.University.build( universityUniVecJSON );
    }
    universityUniVec.setAddress(addressUniVec, {save: false});
    await universityUniVec.save();


    /**
     * Hochschule
     */

    let addressHsOsJSON = {
      street: 'Albrechtstraße',
      number: "30",
      city: "Osnabrück",
      zip: 49076,
      country: "Germany"
    };
    let addressHsOs = await models.Address.findOne({where: addressHsOsJSON} );
    if(addressHsOs==null){
      addressHsOs = models.Address.build( addressHsOsJSON );
      await addressHsOs.save();
    }

    let universityHsOsJSON = {
      name: "Hochschule Osnabrück",
    };
    let universityHsOs = await models.University.findOne({where: universityHsOsJSON});
    if(universityHsOs==null){
      universityHsOs = models.University.build( universityHsOsJSON );
    }
    universityHsOs.setAddress(addressHsOs, {save: false});
    await universityHsOs.save();




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
