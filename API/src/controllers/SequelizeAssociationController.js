import HttpStatus from "http-status-codes";
import MyExpressRouter from "../module/MyExpressRouter";
import SequelizeHelper from "../helper/SequelizeHelper";
import SequelizeRouteHelper from "../helper/SequelizeRouteHelper";
import SequelizeController from "./SequelizeController";
import DefaultControllerHelper from "../helper/DefaultControllerHelper";

export default class SequelizeAssociationController {

    // api/models/Users/1/associations/Roles
    // api/models/Users/1/associations/Role/2
    // api/models/Users/1/associations/count/Roles


    constructor(logger, models, expressApp, myAccessControl, myExpressRouter) {
        this.logger = logger;
        this.models = models;
        this.expressApp = expressApp;
        this.myAccessControl = myAccessControl;
        this.myExpressRouter = myExpressRouter;
        this.functionsForModels = {};
    }

    configureModelAssociationRoutes(model,sequelizeController){
        let tableAssociations = SequelizeHelper.getAssociationForModelJSON(model);
        let tableName = SequelizeHelper.getTableName(model);
        console.log("Configure Associations for: "+tableName);

        let modelAssociationNames = Object.keys(tableAssociations);

        for(let j=0; j<modelAssociationNames.length; j++){
            let modelAssociationName = modelAssociationNames[j];
            let associationObject = tableAssociations[modelAssociationName].options;
            let associationTargetModel = tableAssociations[modelAssociationName].target;
            let pluralName = associationObject["name"]["plural"];
            let singularName = associationObject["name"]["singular"];

            console.log("  configuring association to: "+modelAssociationName + " as ("+SequelizeHelper.getTableName(associationTargetModel)+")");

            let hasManyAssociated = pluralName === modelAssociationName;

            let accessControlAssociationResource = "Association"+tableName+modelAssociationName;

            if(hasManyAssociated){ // e.G. User has many Feedbacks
                console.log("    Configure Primary Param Checker")
                SequelizeController.configurePrimaryParamsChecker(this.expressApp,associationTargetModel,accessControlAssociationResource); //configure the params for identifing the resource

                // GET /Users/1/associations/count/Feedbacks
                console.log("    Configure Count Associtation");
                this.configureModelCountAssociationInstanceRoute(model,pluralName,modelAssociationName);

                // GET /Users/1/associations/Feedbacks ==> Get List of all Feedbacks
                    //pagination, search, filter, ...

                // POST /Users/1/associations/Feedbacks ==> Add List of all Feedbacks

                // PUT /Users/1/associations/Feedbacks ==> Replace List of all Feedbacks

                // DELETE /Users/1/associations/Feedbacks ==> Clear List of all Feedbacks


                // GET /Users/1/associations/Feedback/3 ==> Get single specific Feedback
                this.configureMultipleAssociationsGetSpecificRoute(model,modelAssociationName,associationTargetModel,accessControlAssociationResource);

                // POST /Users/1/associations/Feedback ==> Add Association Feedback
                // POST /Users/1/associations/Feedback/3 ==> Add Association Feedback to specific

                // DELETE /Users/1/associations/Feedback/3 ==> Remove Association to Feedback
                this.configureMultipleAssociationsRemoveSpecificRoute(model,modelAssociationName,associationTargetModel,accessControlAssociationResource);
            } else {
                // GET /Users/1/associations/count/Feedback

                // GET /Users/1/associations/Feedback ==> Get single Feedback

                // POST /Users/1/associations/Feedback ==> Add Association Feedback
                // POST /Users/1/associations/Feedback/3 ==> Add Association Feedback to specific

                // PUT /Users/1/associations/Feedback/3 ==> Replace Association Feedback to specific

                // DELETE /Users/1/associations/Feedback ==> Remove Association to Feedback
            }
        }
    }


    configureModelCountAssociationInstanceRoute(model,pluralName,modelAssociationName){
        let methodName = SequelizeRouteHelper.METHOD_COUNT_PREFIX;

        let associationFunction = methodName+modelAssociationName;
        let tableName = SequelizeHelper.getTableName(model);

        console.log("Configure Count Associtation: "+tableName+" "+associationFunction+" ");
        let functionForModel = async function(req, res){ //define the get function

            //TODO Permission

            let resource = req.locals[tableName];
            let amount = await resource[associationFunction]();
            let dataJSON = {
                count: amount
            };
            MyExpressRouter.responseWithJSON(res, HttpStatus.OK, dataJSON);
        }

        let associationRoute = SequelizeRouteHelper.getModelAssociationMethodRoute(model,methodName,modelAssociationName);
        this.expressApp.get(associationRoute, functionForModel.bind(this)); // register route in express

    }


    configureMultipleAssociationsGetSpecificRoute(model,modelAssociationName,associationModel,accessControlAssociationResource){
        console.log("configure association route: configureMultipleAssociationsGetSpecificRoute");

        let functionForModel = async function(req, res) { //define the get function
            //just call the default GET
            this.myExpressRouter.defaultControllerHelper.handleGet(req, res, this.myAccessControl, accessControlAssociationResource);
        }

        let route = SequelizeRouteHelper.getModelAssociationInstanceRoute(model,modelAssociationName,accessControlAssociationResource,associationModel);
        console.log("Route: "+route);
        this.expressApp.get(route, functionForModel.bind(this)); // register route in express
    }


    configureMultipleAssociationsRemoveSpecificRoute(model,modelAssociationName,associationModel,accessControlAssociationResource) {
        console.log("configure association route: configureMultipleAssociationsGetSpecificRoute");

        let functionForModel = async function (req, res) { //define the get function
            //just call the default GET
            this.myExpressRouter.defaultControllerHelper.handleGet(req, res, this.myAccessControl, accessControlAssociationResource);
        }

        let route = SequelizeRouteHelper.getModelAssociationInstanceRoute(model, modelAssociationName, accessControlAssociationResource, associationModel);
        console.log("Route: " + route);
        this.expressApp.get(route, functionForModel.bind(this)); // register route in express
    }




}
