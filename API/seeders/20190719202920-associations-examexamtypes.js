'use strict';

var models = require('./../models');


module.exports = {
  up: async (queryInterface, Sequelize) => {

    let modelSync = await models.sequelize.sync();
    //console.log("Okay models should now be synced");

    let examtype = await models.Examtype.findOne();
    let exams = await models.Exam.findAll();

    for(let i=0; i<exams.length; i++){
      let exam = exams[i];
      exam.setExamtype(examtype);
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
