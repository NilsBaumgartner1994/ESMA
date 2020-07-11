'use strict';

var models = require('./../models');
var recipesJSON = require('./recipes.json'); //with path

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
    for(let i=0; i<recipesJSON.length; i++){
      console.log("\rProgress: "+i+"/"+recipesJSON.length);

      let item = recipesJSON[i];

      let recipeGroupName = item["recipeGroup"];
      let recipeTypeName = item["recipeType"];
      let recipeGroup = await models.RecipeGroup.findOne({where: {name: recipeGroupName}});
      if(recipeGroup==null){
        recipeGroup = await models.RecipeGroup.create({name: recipeGroupName});
      }

      let recipeType = await models.RecipeType.findOne({where: {name: recipeTypeName}});
      if(recipeType==null){
        recipeType = await models.RecipeType.create({name: recipeTypeName});
      }

      await recipeGroup.setRecipeType(recipeType);

      let recipeId = item["id"];
      let mealName = item["description"];
      let recipe = await models.Recipe.findOne({ where: {id: recipeId} });
      if(recipe===null){
        recipe = await models.Recipe.create({id: recipeId,name: mealName});
      }

      await recipe.setRecipeGroup(recipeGroup);

      let recipeMarkingIds = item["recipeMarking"];
      for(let recipeMarkingIdsIndex = 0; recipeMarkingIdsIndex<recipeMarkingIds.length; recipeMarkingIdsIndex++){
        let markingId = recipeMarkingIds[recipeMarkingIdsIndex];
	if(markingId == 0){
	    cosnole.log("Whooops at found marking Id 0");
	    console.log(item);
	}

        let marking = await models.Marking.findOne({ where: {id: markingId} });
	if(isNaN(markingId)){ // cause "j" is NaN but "4" is
	    marking = await models.Marking.findOne({where: {letter: markingId}});
	}

        if(marking!==null){
    	  await recipe.addMarking(marking);
	} else {
	   console.log("Wooo boy what is Marking: "+markingId);
	}
      }
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

    return queryInterface.bulkDelete('Reciepes', null, {});
  }
};
