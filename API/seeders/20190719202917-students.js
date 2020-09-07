'use strict';

var models = require('./../models');


module.exports = {
  up: async (queryInterface, Sequelize) => {

    let listOfStudents = [
      {
        "id": 955625,
        "firstname":"Nils",
        "lastname":"Baumgartner",
        "mail":"nbaumgartner@uos.de"
      },
      {
        "id": 123456,
        "firstname":"Rick",
        "lastname":"Astley",
        "mail":"rick@astley.de"
      },

    ]

    let modelSync = await models.sequelize.sync();
    //console.log("Okay models should now be synced");

    for(let i=0; i<listOfStudents.length; i++){
      let type = listOfStudents[i];
      let student = await models.Student.findOne({where: {id: type.id}});
      if(!student){
        student = models.Student.build(type);
        await student.save();
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
