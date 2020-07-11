'use strict';

var models = require('./../models');
var residences_de = require('./residences_de.json'); //with path
var residences_en = require('./residences_en.json'); //with path

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
    for(let i=0; i<residences_de.length; i++) {
      console.log("Progress: " + i + "/" + residences_de.length);

      let item_de = residences_de[i];

      //Find or Create an Address
      let adresse= item_de["adresse"];
      let zip= item_de["plz"];
      let city= item_de["ort"];

      let addressJSON = {
        street: adresse,
        number: "",
        city: city,
        zip: zip,
        country: "Germany"
      };
      let address = await models.Address.findOne({where: addressJSON} );
      if(address==null){
        address = models.Address.build( addressJSON );
        await address.save();
      }

      let title  = item_de["title"];
      let latitude = item_de["latitude"];
      let longitude = item_de["longitude"];
      let short = item_de["short"];

      //Find or Create an Building
      let buildingJSON = {
        short: short,
        name: title,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };
      let building = await models.Building.findOne({where: {short: short}} );
      if(building==null){
        building = models.Building.build( buildingJSON );
      }
      building.setAddress(address, {save: false});
      let newBuilding = await building.save();

      let size = item_de["groesse"];
      let rooms = item_de["anz_zimmer"];
      let description = item_de["description"];
      let livingWithChild = item_de["wohnen_mit_kind"];
      let livingWithHandicap = item_de["wohnen_mit_handicap"];
      let singleFlat = item_de["einzelappartment"];

      let residenceJSON = {
        name: title,
        size: size,
        rooms: rooms,
        description: description,
        livingWithChild: livingWithChild,
        livingWithHandicap: livingWithHandicap,
        singleFlat: singleFlat
      };


      let residence = await models.Residence.findOne({where: residenceJSON} );
      if(residence==null){
        residence = models.Residence.build( residenceJSON );
      }
      residence.setBuilding(building, {save: false});
      let newResidence = await residence.save();
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

    return queryInterface.bulkDelete('Residences', null, {});
  }
};
