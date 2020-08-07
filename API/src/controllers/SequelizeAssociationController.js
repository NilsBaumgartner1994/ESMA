import HttpStatus from "http-status-codes";
import MyExpressRouter from "../module/MyExpressRouter";
import SequelizeHelper from "../helper/SequelizeHelper";
import SequelizeRouteHelper from "../helper/SequelizeRouteHelper";
import SequelizeController from "./SequelizeController";

export default class SequelizeAssociationController {

    constructor(logger, models, expressApp, myAccessControl, myExpressRouter) {
        this.logger = logger;
        this.models = models;
        this.expressApp = expressApp;
        this.myAccessControl = myAccessControl;
        this.myExpressRouter = myExpressRouter;
        this.functionsForModels = {};
    }

    configureModelAssociationRoutes(model, level=1, maxLevel=2){
        let tableAssociations = SequelizeHelper.getAssociationForModelJSON(model);
        let tableName = SequelizeHelper.getTableName(model);

        for(let j=0; j<tableAssociations.length; j++){
            let associationObject = tableAssociations[j];
            let modelAssociationObjects = Object.keys(associationObject);
            let modelAssociationName = modelAssociationObjects[0];
            let pluralName = associationObject[modelAssociationName]["name"]["plural"];
            let singularName = associationObject[modelAssociationName]["name"]["singular"];

            let isPlural = pluralName === modelAssociationName;
            let associationBaseRoute = SequelizeRouteHelper.getInstanceAssociationRoute(model,modelAssociationName);

            this.configureModelGetAssociationRoute(model,pluralName,modelAssociationName,isPlural,associationBaseRoute);
            this.configureModelGetAssociationInstanceRoute(model,pluralName,modelAssociationName,isPlural,associationBaseRoute);
            this.configureModelSetSingleAssociationInstanceRoute(model,pluralName,modelAssociationName,isPlural,associationBaseRoute,singularName);
            if(isPlural){
                this.configureModelCountAssociationInstanceRoute(model,pluralName,modelAssociationName,isPlural,associationBaseRoute,singularName);
                this.configureModelSetMultipleAssociationInstanceRoute(model,pluralName,modelAssociationName,isPlural,associationBaseRoute,singularName);
                this.configureModelPluralAddSingleAssociationInstanceRoute(model,pluralName,modelAssociationName,isPlural,associationBaseRoute,singularName);
                this.configureModelPluralAddMultipleAssociationInstanceRoute(model,pluralName,modelAssociationName,isPlural,associationBaseRoute,singularName);
                this.configureModelPluralRemoveSingleAssociationInstanceRoute(model,pluralName,modelAssociationName,isPlural,associationBaseRoute,singularName);
                this.configureModelPluralRemoveMultipleAssociationInstanceRoute(model,pluralName,modelAssociationName,isPlural,associationBaseRoute,singularName);
            }
        }

        console.log("");
    }

    configureModelGetAssociationInstanceRoute(model,pluralName,modelAssociationName,isPlural,associationBaseRoute){

    }

    configureModelGetAssociationRoute(model,pluralName,modelAssociationName,isPlural,associationBaseRoute){

        let associationFunction = "get"+modelAssociationName;
        let tableName = SequelizeHelper.getTableName(model);

        let functionForModel = null;
        if(isPlural){
            functionForModel = async function(req, res){ //define the get function
                //just call the default GET
                console.log("Handle INDEX Association Request");
                let resource = req.locals[tableName];

                this.myExpressRouter.defaultControllerHelper.handleAssociationIndex(req,res,resource,this.myAccessControl,pluralName,pluralName,associationGetFunction);
            }
        } else {
            functionForModel = async function(req, res){ //define the get function
                //just call the default GET
                console.log("Handle GET Association Request");
                console.log("associationGetFunction: "+associationFunction);

                let resource = req.locals[tableName];
                console.log(resource);
                req.locals[modelAssociationName] = await resource[associationFunction]();
                await SequelizeController.setOwningState(req,modelAssociationName);

                console.log("Now Pass default Controller Helper");

                this.myExpressRouter.defaultControllerHelper.handleGet(req, res, this.myAccessControl, pluralName, modelAssociationName, SequelizeController.getOwningState(req,tableName));
            }
        }

        console.log("associationBaseRoute: "+associationBaseRoute);
        this.expressApp.get(associationBaseRoute, functionForModel.bind(this)); // register route in express
    }

    //TODO implement
    configureModelCountAssociationInstanceRoute(model,pluralName,modelAssociationName,isPlural,associationBaseRoute,singularName){
        let associationFunction = "count"+modelAssociationName;
        let tableName = SequelizeHelper.getTableName(model);

        console.log("Count Associtation: "+tableName+" "+associationFunction+" ");
    }

    //TODO implement
    configureModelSetSingleAssociationInstanceRoute(model,pluralName,modelAssociationName,isPlural,associationBaseRoute,singularName){

        let associationFunction = "set"+singularName;
        let tableName = SequelizeHelper.getTableName(model);

        console.log("Set Single Associtation: "+tableName+" --> "+associationFunction);
    }

    //TODO implement
    configureModelSetMultipleAssociationInstanceRoute(model,pluralName,modelAssociationName,isPlural,associationBaseRoute,singularName){

        let associationFunction = "set"+modelAssociationName;
        let tableName = SequelizeHelper.getTableName(model);

        console.log("Set Multiple Associtation: "+tableName+" --> "+associationFunction);
    }

    //TODO implement
    configureModelPluralAddMultipleAssociationInstanceRoute(model,pluralName,modelAssociationName,isPlural,associationBaseRoute,singularName){

        let associationFunction = "add"+modelAssociationName;
        let tableName = SequelizeHelper.getTableName(model);

        console.log("Add Multiple Associtation: "+tableName+" --> "+associationFunction);
    }

    //TODO implement
    configureModelPluralAddSingleAssociationInstanceRoute(model,pluralName,modelAssociationName,isPlural,associationBaseRoute,singularName){

        let associationFunction = "add"+singularName;
        let tableName = SequelizeHelper.getTableName(model);

        console.log("Add Single Associtation: "+tableName+" --> "+associationFunction);
    }

    //TODO implement
    configureModelPluralRemoveMultipleAssociationInstanceRoute(model,pluralName,modelAssociationName,isPlural,associationBaseRoute,singularName){

        let associationFunction = "remove"+modelAssociationName;
        let tableName = SequelizeHelper.getTableName(model);

        console.log("Remove Multiple Associtation: "+tableName+" --> "+associationFunction);
    }

    //TODO implement
    configureModelPluralRemoveSingleAssociationInstanceRoute(model,pluralName,modelAssociationName,isPlural,associationBaseRoute,singularName){

        let associationFunction = "remove"+singularName;
        let tableName = SequelizeHelper.getTableName(model);

        console.log("Remove Single Associtation: "+tableName+" --> "+associationFunction);
    }

}
