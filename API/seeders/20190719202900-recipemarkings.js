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

    try {
      await models.Marking.create({id: 1, classification: "additive", label: null, description: "mit Farbstoff",});
      await models.Marking.create({id: 2, classification: "additive", label: null, description: "mit Konservierungsstoff"});
      await models.Marking.create({id: 3, classification: "additive", label: null, description: "mit Antioxidationsmittel"});
      await models.Marking.create({id: 4, classification: "additive", label: null, description: "mit Geschmacksverstärker"});
      await models.Marking.create({id: 5, classification: "additive", label: null, description: "geschwefelt"});
      await models.Marking.create({id: 6, classification: "additive", label: null, description: "geschwärzt"});
      await models.Marking.create({id: 7, classification: "additive", label: null, description: "gewachst"});
      await models.Marking.create({id: 8, classification: "additive", label: null, description: "mit Phosphat"});
      await models.Marking.create({id: 9, classification: "additive", label: null, description: "mit Süßungsmitteln"});
      await models.Marking.create({id: 10, classification: "additive", label: null, description: "enthält eine Phenylalaninquelle"});
      await models.Marking.create({id: 12, classification: "lifestyle", label: null, description: "Mensa Vital"});
      await models.Marking.create({id: 13, classification: "lifestyle", label: null, description: "Schweinefleisch"});
      await models.Marking.create({id: 14, classification: "lifestyle", label: null, description: "Rindfleisch"});
      await models.Marking.create({id: 15, classification: "lifestyle", label: null, description: "Alkohol"});
      await models.Marking.create({id: 17, classification: "lifestyle", label: null, description: "Knoblauch"});
      await models.Marking.create({id: 18, classification: "lifestyle", label: null, description: "Fleisch aus artgerechter Tierhaltung"});
      await models.Marking.create({id: 19, classification: "lifestyle", label: null, description: "Bio-Erzeugnis"});
      await models.Marking.create({id: 20, classification: "lifestyle", label: null, description: "vegetarisch"});
      await models.Marking.create({id: 21, classification: "lifestyle", label: null, description: "vegan"});
      await models.Marking.create({id: 24, classification: "lifestyle", label: null, description: "Fisch aus nachhaltiger Fischerei"});
      await models.Marking.create({id: 25, classification: "lifestyle", label: null, description: "mit Gelatine"});
      await models.Marking.create({id: 26, classification: "allergen", label: "e", description: "Erdnüssse"});
      await models.Marking.create({id: 27, classification: "allergen", label: "d", description: "Fisch"});
      await models.Marking.create({id: 28, classification: "allergen", label: "a", description: "Glutenhaltiges Getreide"});
      await models.Marking.create({id: 29, classification: "allergen", label: "n", description: "Weichtiere"});
      await models.Marking.create({id: 30, classification: "allergen", label: "c", description: "Hühnerei"});
      await models.Marking.create({id: 31, classification: "allergen", label: "b", description: "Krebstiere"});
      await models.Marking.create({id: 32, classification: "allergen", label: "l", description: "Lupine"});
      await models.Marking.create({id: 33, classification: "allergen", label: "g", description: "Milch und Laktose"});
      await models.Marking.create({id: 34, classification: "allergen", label: "h", description: "Schalenfrüchte (Nüsse)"});
      await models.Marking.create({id: 35, classification: "allergen", label: "k", description: "Schwefeldioxid u. Sulfite"});
      await models.Marking.create({id: 36, classification: "allergen", label: "i", description: "Sellerie"});
      await models.Marking.create({id: 37, classification: "allergen", label: "j", description: "Senf"});
      await models.Marking.create({id: 38, classification: "allergen", label: "m", description: "Sesam"});
      await models.Marking.create({id: 39, classification: "allergen", label: "f", description: "Soja"});
      await models.Marking.create({id: 40, classification: "lifestyle", label: null, description: "Geflügel"});
      await models.Marking.create({id: 100, classification: "lifestyle", label: "O", description: "zusatzstoff- und allergenfrei"});
    } catch (e) {
      console.log("Already Seeded ?");
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

    return queryInterface.bulkDelete('Markings', null, {});
  }
};
