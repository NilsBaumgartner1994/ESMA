'use strict';

var models = require('./../models');

const resourceJSONs = [{
  pseudonym: 'Seed-FriendA',
  language: "de",
  privacyPolicyReadDate: new Date(),
},
  {
    pseudonym: 'Seed-FriendB',
    language: "de",
    privacyPolicyReadDate: new Date(),
  }];

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

    for(let i=0; i<resourceJSONs.length; i++){
      let resourceJSON = resourceJSONs[i];

      let model = await models.User.findOne({where: resourceJSON} );
      if(model==null){
        model = models.User.build( resourceJSON );
        await model.save();
      }
    }

    let friendA = await models.User.findOne({where: resourceJSONs[0]});
    let friendB = await models.User.findOne({where: resourceJSONs[1]});

    await friendA.addFriend(friendB);
    await friendB.addFriend(friendA);

    return;
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

    for(let i=0; i<resourceJSONs.length; i++){
      let resourceJSON = resourceJSONs[i];

      let model = await models.User.findOne({where: resourceJSON} );
      if(model==null){
        await model.delete();
      }
    }

    return
  }
};
