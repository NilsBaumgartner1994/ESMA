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

    /**
     * Mensa und Bistro Westerberg
     */
    console.log("Start Mensa und Bistro Westerberg");

    let addressMWJSON = {
      street: 'Barbarastraße',
      number: "20",
      city: "Osnabrück",
      zip: 49076,
      country: "Germany"
    };
    let addressMW = await models.Address.findOne({where: addressMWJSON} );
    if(addressMW==null){
      addressMW = models.Address.build( addressMWJSON );
      await addressMW.save();
    }

    let buildingMWJSON = {
      short: 'M-W',
      name: "Mensa und Bistro Westerberg",
      latitude: 52.284415,
      longitude: 8.022585,
    };
    let buildingMW = await models.Building.findOne({where: {name: buildingMWJSON.name, short: buildingMWJSON.short}} );
    if(buildingMW==null){
      buildingMW = models.Building.build( buildingMWJSON );
    }
    buildingMW.setAddress(addressMW, {save: false});
    await buildingMW.save();

    let canteenMWJSON = {name: "Mensa Westerberg"};
    let canteenMW = await models.Canteen.findOne({where: canteenMWJSON} );
    if(canteenMW==null){
      canteenMW = models.Canteen.build( canteenMWJSON );
    }
    canteenMW.setBuilding(buildingMW, {save: false});
    await canteenMW.save();

    let canteenMWCafeJSON = {name: "Cafeteria Westerberg"};
    let canteenMWCafe = await models.Canteen.findOne({where: canteenMWCafeJSON} );
    if(canteenMWCafe==null){
      canteenMWCafe = models.Canteen.build( canteenMWCafeJSON );
    }
    canteenMWCafe.setBuilding(buildingMW, {save: false});
    await canteenMWCafe.save();


    /**
     * Mensa und Cafeteria Schlossgarten Osnabrück
     */
    console.log("Start Mensa und Cafeteria Schlossgarten Osnabrück");

    let addressSchlossJSON = {
      street: 'Ritterstraße',
      number: "10",
      city: "Osnabrück",
      zip: 49076,
      country: "Germany"
    };
    let addressSchloss = await models.Address.findOne({where: addressSchlossJSON} );
    if(addressSchloss==null){
      addressSchloss = models.Address.build( addressSchlossJSON );
    }
    await addressSchloss.save();

    let buildingSchlossJSON = {
      short: 'M',
      name: "Mensa und Cafeteria Schlossgarten",
      latitude: 52.284415,
      longitude: 8.022585,
    };
    let buildingSchloss = await models.Building.findOne({where: {short: buildingSchlossJSON.short, name: buildingSchlossJSON.name}} );
    if(buildingSchloss==null){
      buildingSchloss = models.Building.build( buildingSchlossJSON );
    }
    buildingSchloss.setAddress(addressSchloss, {save: false});
    await buildingSchloss.save();

    let canteenMensaSchlossJSON = {name: "Mensa Schlossgarten"};
    let canteenMensaSchloss = await models.Canteen.findOne({where: canteenMensaSchlossJSON} );
    if(canteenMensaSchloss==null){
      canteenMensaSchloss = models.Canteen.build( canteenMensaSchlossJSON );
    }
    canteenMensaSchloss.setBuilding(buildingSchloss, {save: false});
    await canteenMensaSchloss.save();

    let canteenCafeteriaSchlossJSON = {name: "Cafeteria Schlossgarten"};
    let canteenCafeteriaSchloss = await models.Canteen.findOne({where: canteenCafeteriaSchlossJSON} );
    if(canteenCafeteriaSchloss==null){
      canteenCafeteriaSchloss = models.Canteen.build( canteenCafeteriaSchlossJSON );
    }
    canteenCafeteriaSchloss.setBuilding(buildingSchloss, {save: false});
    await canteenCafeteriaSchloss.save();

    /**
     * Caprivi
     */
    console.log("Caprivi");

    let addressCapriviJSON = {
      street: 'Bismarckstraße',
      number: "60a",
      city: "Osnabrück",
      zip: 49076,
      country: "Germany"
    };
    let addressCaprivi = await models.Address.findOne({where: addressCapriviJSON} );
    if(addressCaprivi==null){
      addressCaprivi = models.Address.build( addressCapriviJSON );
      await addressCaprivi.save();
    }

    let buildingCapriviJSON = {
      short: 'CM',
      name: "Bistro Caprivi",
      latitude: 52.277812,
      longitude: 8.023249,
    };
    let buildingCaprivi = await models.Building.findOne({where: {short: buildingCapriviJSON.short, name: buildingCapriviJSON.name}} );
    if(buildingCaprivi==null){
      buildingCaprivi = models.Building.build( buildingCapriviJSON );
    }
    buildingCaprivi.setAddress(addressCaprivi, {save: false});
    await buildingCaprivi.save();

    let canteenCapriviJSON = {name: "Bistro Caprivi"};
    let canteenCaprivi = await models.Canteen.findOne({where: canteenCapriviJSON} );
    if(canteenCaprivi==null){
      canteenCaprivi = models.Canteen.build( canteenCapriviJSON );
    }
    canteenCaprivi.setBuilding(buildingCaprivi, {save: false});
    await canteenCaprivi.save();

    /**
     * Mensa Haste
     */
    console.log("Haste");

    let addressHasteJSON = {
      street: 'Oldenburger Landstraße',
      number: "",
      city: "Osnabrück",
      zip: 49076,
      country: "Germany"
    };
    let addressHaste = await models.Address.findOne({where: addressHasteJSON} );
    if(addressHaste==null){
      addressHaste = models.Address.build( addressHasteJSON );
      await addressHaste.save();
    }

    let buildingHasteJSON = {
      short: 'HG',
      name: "Mensa Haste",
      latitude: 52.304712,
      longitude: 8.040188,
    };
    let buildingHaste = await models.Building.findOne({where: {short: buildingHasteJSON.short, name: buildingHasteJSON.name}} );
    if(buildingHaste==null){
      buildingHaste = models.Building.build( buildingHasteJSON );
    }
    buildingHaste.setAddress(addressHaste, {save: false});
    await buildingHaste.save();

    let canteenHasteJSON = {name: "Mensa Haste"};
    let canteenHaste = await models.Canteen.findOne({where: canteenHasteJSON} );
    if(canteenHaste==null){
      canteenHaste = models.Canteen.build( canteenHasteJSON );
    }
    canteenHaste.setBuilding(buildingHaste, {save: false});
    await canteenHaste.save();

    /**
     * Mensa Lingen
     */
    console.log("Lingen");

    let addressLingenJSON = {
      street: 'Kaiserstraße',
      number: "10e",
      city: "Lingen",
      zip: 49809,
      country: "Germany"
    };
    let addressLingen = await models.Address.findOne({where: addressLingenJSON} );
    if(addressLingen==null){
      addressLingen = models.Address.build( addressLingenJSON );
      await addressLingen.save();
    }

    let buildingLingenJSON = {
      short: 'KM',
      name: "Mensa Lingen",
      latitude: 52.519837,
      longitude: 7.323895,
    };
    let buildingLingen = await models.Building.findOne({where: {short: buildingLingenJSON.short, name: buildingLingenJSON.name}} );
    if(buildingLingen==null){
      buildingLingen = models.Building.build( buildingLingenJSON );
    }
    buildingLingen.setAddress(addressLingen, {save: false});
    await buildingLingen.save();

    let canteenLingenJSON = {name: "Mensa Lingen"};
    let canteenLingen = await models.Canteen.findOne({where: canteenLingenJSON} );
    if(canteenLingen==null){
      canteenLingen = models.Canteen.build( canteenLingenJSON );
    }
    canteenLingen.setBuilding(buildingLingen, {save: false});
    await canteenLingen.save();

    /**
     * Mensa Vechta
     */
    console.log("Vechta");

    let addressVechtaJSON = {
      street: 'Universitätsstraße',
      number: "1",
      city: "Vechta",
      zip: 49377,
      country: "Germany"
    };
    let addressVechta = await models.Address.findOne({where: addressVechtaJSON} );
    if(addressVechta==null){
      addressVechta = models.Address.build( addressVechtaJSON );
      await addressVechta.save();
    }

    let buildingVechtaJSON = {
      short: 'M',
      name: "M-Trakt",
      latitude: 52.720341,
      longitude: 8.295289,
    };
    let buildingVechta = await models.Building.findOne({where: {short: buildingVechtaJSON.short, name: buildingVechtaJSON.name}} );
    if(buildingVechta==null){
      buildingVechta = models.Building.build( buildingVechtaJSON );
    }
    buildingVechta.setAddress(addressVechta, {save: false});
    await buildingVechta.save();

    let canteenVechtaBistroJSON = {name: "Bistro Vechta"};
    let canteenVechtaBistro = await models.Canteen.findOne({where: canteenVechtaBistroJSON} );
    if(canteenVechtaBistro==null){
      canteenVechtaBistro = models.Canteen.build( canteenVechtaBistroJSON );
    }
    canteenVechtaBistro.setBuilding(buildingVechta, {save: false});
    await canteenVechtaBistro.save();

    let canteenVechtaMensaJSON = {name: "Mensa Vechta"};
    let canteenVechtaMensa = await models.Canteen.findOne({where: canteenVechtaMensaJSON} );
    if(canteenVechtaMensa==null){
      canteenVechtaMensa = models.Canteen.build( canteenVechtaMensaJSON );
    }
    canteenVechtaMensa.setBuilding(buildingVechta, {save: false});
    await canteenVechtaMensa.save();

    return;
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

    return queryInterface.bulkDelete('Canteens', null, {});
  }
};
