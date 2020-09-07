'use strict';

var models = require('./../models');


module.exports = {
  up: async (queryInterface, Sequelize) => {

    let listOfTopics = [
      {
        "name": "Modularisierung",
      },
      {
        "name": "Brook’sches Gesetz",
      },
      {
        "name": "Agiles Manifest",
      },
      {
        "name": "Schätzverfahren",
      },
      {
        "name": "Netzplan",
      },
      {
        "name": "Versionskontrollsysteme",
      },
      {
        "name": "Strukturierte Analyse",
      },
      {
        "name": "UML",
      },
      {
        "name": "Zeitdiagramm",
      },
      {
        "name": "Softwarelebensläufe",
      },
      {
        "name": "Design by Contract",
      },
      {
        "name": "Meilenstein-Trendanalyse",
      },
      {
        "name": "Entity-Relationship Modellierung",
      },
      {
        "name": "Programmablaufplan",
      },
      {
        "name": "UML Zustandsdiagramm",
      },
      {
        "name": "V-Modell",
      },
      {
        "name": "JUnit",
      },
      {
        "name": "UML Zustandsdiagramm",
      },
      {
        "name": "Modularisierung",
      },
      {
        "name": "Aktivitätsdiagramm",
      },
      {
        "name": "Vorgehensmodelle",
      }
    ]

    let modelSync = await models.sequelize.sync();
    //console.log("Okay models should now be synced");

    for(let i=0; i<listOfTopics.length; i++){
      let type = listOfTopics[i];
      let topic = await models.Topic.findOne({where: {name: type.name}});
      if(!topic){
        topic = models.Topic.build(type);
        await topic.save();
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

    return
  }
};
