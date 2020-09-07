'use strict';

var models = require('./../models');


module.exports = {
  up: async (queryInterface, Sequelize) => {

    let listOfExams = [
      {
        "name": "SWE",
        "year": "2021",
        "startDate": new Date("2021-04-01T10:00:00.000"),
        "endDate": new Date("2021-04-01T12:00:00.000")
      },
    ]

    let modelSync = await models.sequelize.sync();
    //console.log("Okay models should now be synced");

    for(let i=0; i<listOfExams.length; i++){
      let type = listOfExams[i];
      let exam = await models.Exam.findOne({where: {name: type.name}});
      if(!exam){
        exam = models.Exam.build(type);
        await exam.save();
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
