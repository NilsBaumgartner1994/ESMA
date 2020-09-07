'use strict';

var models = require('./../models');


module.exports = {
  up: async (queryInterface, Sequelize) => {

    let listOfExamtypes = [
      {
        "name": "Oral exam",
        "description": "The student has to answer the question in such a way as to demonstrate sufficient knowledge of the subject to pass the exam."
      },
      {
        "name": "Presence exam",
        "description": "The student has to be physical at the test and can therefore be observes, so that cheating is hard."
      },
      {
        "name": "E-exam",
        "description": "The student has access to a computer and maybe also to the internet."
      },
      {
        "name": "Online exam",
        "description": "The student has a time limit for the exam but is not observed. Speaking with third party is not allowed, but can't be checked directly."
      }
    ]

    let modelSync = await models.sequelize.sync();
    //console.log("Okay models should now be synced");

    for(let i=0; i<listOfExamtypes.length; i++){
      let type = listOfExamtypes[i];
      let examtype = await models.Examtype.findOne({where: {name: type.name}});
      if(!examtype){
        examtype = models.Examtype.build(type);
        await examtype.save();
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
