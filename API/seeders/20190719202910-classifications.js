'use strict';

var models = require('./../models');


module.exports = {
  up: async (queryInterface, Sequelize) => {

    let listOfBloomsTaxonomyClassifications = [
      {
        "level": 1,
        "name": "Knowledge",
        "description": "Remember previously learned information. Recall data or information."
      },
      {
        "level": 2,
        "name": "Comprehension",
        "description": "Demonstrate an understanding of the facts. Demonstrate understanding of the meaning and ideas by organizing, comparing, translating, summarizing, and giving descriptions, and can state a problem in one's own words."
      },
      {
        "level": 3,
        "name": "Application",
        "description": "Apply knowledge to a new situation. Use acquired knowledge by applying a concept in a new situation or different way."
      },
      {
        "level":4,
        "name": "Analysis",
        "description": "Break down information into simpler parts and find evidence to support generalizsations. Examine and break information or concepts into component parts so that its organizational structure may be understood. Make inferences and able to disstinguishes between facts and inferences."
      },
      {
        "level":5,
        "name": "Synthesis",
        "description": "Compile information in a different way or propose alternative solutions. Compile information in a different way by combining elements in a new pattern or proposing alternative solutions. Build a structure or pattern from diverse elements. Able to put parts together to form a whole."
      },
      {
        "level":6,
        "name":"Evaluation",
        "description": "Make and defend judgments about the value of ideas. Make judgments about the value of ideas or materials and able to present and defend opinions based on a set of criteria."
      }
    ]

    let modelSync = await models.sequelize.sync();
    //console.log("Okay models should now be synced");

    for(let i=0; i<listOfBloomsTaxonomyClassifications.length; i++){
      let classification = listOfBloomsTaxonomyClassifications[i];
      let tasklevel = await models.Classification.findOne({where: {level: classification.level, name: classification.name}});
      if(!tasklevel){
        tasklevel = models.Classification.build(classification);
        await tasklevel.save();
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
