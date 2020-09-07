'use strict';

var models = require('./../models');


module.exports = {
  up: async (queryInterface, Sequelize) => {

    let modelSync = await models.sequelize.sync();
    //console.log("Okay models should now be synced");

    let students = await models.Student.findAll();
    let exams = await models.Exam.findAll();

    for(let i=0; i<exams.length; i++){
      let exam = exams[i];
      for(let j=0; j<students.length; j++){
        let student = students[j];
        let hasStudent = await exam.hasStudent(student);
        console.log("has Exam Student: "+hasStudent);
        if(!hasStudent){
          console.log("Student added");
          await exam.addStudent(student);
        }
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
