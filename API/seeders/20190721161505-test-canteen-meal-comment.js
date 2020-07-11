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

    // Build a Canteen
    let mensaBuilding = await models.Building.build( {
      short: 'M',
      detailed: "Mensa Westerberg",
      latitude: 52.002,
      longitude: 8.3002,
    } );
    await mensaBuilding.save();
    let mensa = await models.Canteen.build( {
    } );
    await mensa.setBuilding(mensaBuilding);
    await mensa.save();

    // Build a User
    let nils = await models.User.build( {
      pseudonym: 'Nils'
    } );
    await nils.save();

    //console.log(nils.pseudonym);


    // Build a Meal
    let pommes = await models.Meal.build( {
      unique_name: 'Pommes'
    } );
    await pommes.save();


    //console.log("Create now the Meal Comment");

    let schnitzel = await models.Meal.build( {
      unique_name: 'Schnitzel'
    } );
    await schnitzel.save();

    let mealComment = models.MealComment.build({text: "Tolle Wurst"});

    //console.log("1");
    //console.log(mealComment);
    await mealComment.save();

    //console.log("3");
    //console.log(mealComment);
    await mealComment.setUser(nils,{save: false});
    await mealComment.setMeal(pommes,{save:false});
    await mealComment.setCanteen(mensa,{save:false});

    //console.log(mealComment);
    await mealComment.save();

    let allMealComments = await models.MealComment.findAll();
    //console.log(allMealComments[0]);
    let amountMealCommentsBefore = allMealComments.length;

    let pommesComments = await pommes.getMealComments();
    //console.log("Pommes Comments Before Destroy: "+pommesComments.length);
    let amountMealCommentsOfPommesBefore = pommesComments.length;

    allMealComments = await models.MealComment.findAll();
    //console.log("Total Meal Comments Before Destroy: "+allMealComments.length);

    await pommes.destroy();

    pommesComments = await pommes.getMealComments();
    //console.log("Pommes Comments After Destroy: "+pommesComments.length);
    let amountMealCommentsOfPommesAfter = pommesComments.length;

    allMealComments = await models.MealComment.findAll();
    //console.log("Total Meal Comments After Destroy: "+allMealComments.length);
    let amountMealCommentsAfter = allMealComments.length;

    console.log("Meals MealComments working: "+(amountMealCommentsOfPommesBefore==(amountMealCommentsOfPommesAfter+1)));
    console.log("MealComments general working: "+(amountMealCommentsBefore==(amountMealCommentsAfter+1)));

    //console.log("All Done");
     */

    return;
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

    return queryInterface.bulkDelete('Buildings', null, {});
  }
};
