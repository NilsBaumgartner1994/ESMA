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

    static getForAllModelsAllAccessControlAssociationResources(models){
        let modelList = SequelizeHelper.getModelList(models); //first get all models
        let allAccessControlAssociations = [];
        for(let i=0; i<modelList.length; i++) { //for every model
            let model = modelList[i];
            allAccessControlAssociations = allAccessControlAssociations.concat(SequelizeAssociationController.getAccessControlAssociationResourcesForModel(model));
        }
        return allAccessControlAssociations;
    }

    static getAccessControlAssociationResourcesForModel(model){
        let accessControlAssociationResources = [];

        let tableName = SequelizeHelper.getTableName(model);
        let modelAssociationNames = SequelizeAssociationController.getModelAssociationNames(model);
        for(let j=0; j<modelAssociationNames.length; j++) {
            let modelAssociationName = modelAssociationNames[j];
            let accessControlAssociationResource = "Association" + tableName + modelAssociationName;
            accessControlAssociationResources = accessControlAssociationResources.concat(accessControlAssociationResource);
        }
        return accessControlAssociationResources;
    }

    static getModelAssociationNames(model){
        let tableAssociations = SequelizeHelper.getAssociationForModelJSON(model);
        return Object.keys(tableAssociations);
    }

    configureModelAssociationRoutes(model,sequelizeController){
        let tableAssociations = SequelizeHelper.getAssociationForModelJSON(model);
        let tableName = SequelizeHelper.getTableName(model);
        console.log("Configure Associations for: "+tableName);

        let modelAssociationNames = SequelizeAssociationController.getModelAssociationNames(model);

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
                this.configureMultipleAssociationsIndexRoute(model,modelAssociationName,associationTargetModel,accessControlAssociationResource);

                // POST /Users/1/associations/Feedbacks ==> Add List of all Feedbacks

                // PUT /Users/1/associations/Feedbacks ==> Replace List of all Feedbacks

                // DELETE /Users/1/associations/Feedbacks ==> Clear List of all Feedbacks


                // GET /Users/1/associations/Feedback/3 ==> Get single specific Feedback
                this.configureMultipleAssociationsGetSpecificRoute(model,modelAssociationName,associationTargetModel,accessControlAssociationResource);

                // POST /Users/1/associations/Feedback ==> Add Association Feedback
                // POST /Users/1/associations/Feedback/3 ==> Add Association Feedback to specific

                // DELETE /Users/1/associations/Feedback/3 ==> Remove Association to Feedback
                this.configureMultipleAssociationsRemoveSpecificRoute(model,modelAssociationName,associationTargetModel,accessControlAssociationResource,singularName);
            } else {
                // GET /Users/1/associations/count/Feedback

                // GET /Users/1/associations/Feedback ==> Get single Feedback

                //check if there is an old association, if yes than deny, should use PUT
                // POST /Users/1/associations/Feedback ==> Add Association Feedback
                // POST /Users/1/associations/Feedback/3 ==> Add Association Feedback to specific

                // PUT /Users/1/associations/Feedback/3 ==> Replace Association Feedback to specific

                // DELETE /Users/1/associations/Feedback ==> Remove Association to Feedback
                //this.configureSingleAssociationRemoveRoute(model,modelAssociationName,associationTargetModel,accessControlAssociationResource);
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

    configureMultipleAssociationsIndexRoute(model,modelAssociationName,associationModel,accessControlAssociationResource){
        let associationFunction = "get"+modelAssociationName;
        let tableName = SequelizeHelper.getTableName(model);

        console.log("Configure Index Associtation: "+tableName+" "+associationFunction+" ");
        let functionForModel = async function(req, res){ //define the get function

            let resource = req.locals[tableName];
            let associations = await resource[associationFunction]();
            let permission = DefaultControllerHelper.getPermission(req,this.myAccessControl,accessControlAssociationResource,DefaultControllerHelper.CRUD_READ,false);
            //TODO Permission, associationObject itself needs to be readed for normal users or they get it as permission
            DefaultControllerHelper.respondWithPermissionFilteredResources(req, res, associations, permission);
        }

        let associationRoute = SequelizeRouteHelper.getModelAssociationBaseRoute(model,modelAssociationName);
        console.log("Association Route: "+associationRoute);
        this.expressApp.get(associationRoute, functionForModel.bind(this)); // register route in express

    }


    configureMultipleAssociationsGetSpecificRoute(model,modelAssociationName,associationModel,accessControlAssociationResource){
        console.log("configure association route: configureMultipleAssociationsGetSpecificRoute");

        let functionForModel = async function(req, res) { //define the get function
            //just call the default GET
            this.myExpressRouter.defaultControllerHelper.handleGet(req, res, this.myAccessControl, accessControlAssociationResource);
        }

        let route = SequelizeRouteHelper.getModelAssociationInstanceRoute(model,modelAssociationName,accessControlAssociationResource,associationModel);
        console.log("Association Route: "+route);
        this.expressApp.get(route, functionForModel.bind(this)); // register route in express
    }


    configureMultipleAssociationsRemoveSpecificRoute(model,modelAssociationName,associationModel,accessControlAssociationResource,singularName) {
        console.log("configure association route: configureMultipleAssociationsGetSpecificRoute");
        let tableName = SequelizeHelper.getTableName(model);
        let associatedTableName = SequelizeHelper.getTableName(associationModel);

        let functionForModel = async function (req, res) { //define the get function
            //just call the default GET
            let permission = DefaultControllerHelper.getPermission(req,this.myAccessControl,accessControlAssociationResource,DefaultControllerHelper.CRUD_DELETE,false);
            if(permission.granted){
                let resource = req.locals[tableName];
                let associatedResource = req.locals[accessControlAssociationResource];

                let isAssociated = await resource["has"+singularName](associatedResource);
                console.log(isAssociated);
                if(isAssociated){
                    resource["remove"+singularName](associatedResource).then(success => {
                        DefaultControllerHelper.respondWithDeleteMessage(req, res);
                    }).catch(err => {
                        DefaultControllerHelper.respondWithInternalErrorMessage(req,res,err);
                    });
                }
            } else {
                DefaultControllerHelper.respondWithForbiddenMessage(req,res,"Delete "+accessControlAssociationResource);
            }

        }

        let route = SequelizeRouteHelper.getModelAssociationInstanceRoute(model, modelAssociationName, accessControlAssociationResource, associationModel);
        console.log("Association Route: " + route);
        this.expressApp.get(route, functionForModel.bind(this)); // register route in express
    }


    /**
     configureSingleAssociationRemoveRoute(model,modelAssociationName,associationModel,accessControlAssociationResource){
        let functionForModel = async function (req, res) { //define the get function
            //just call the default GET
        }
    }
     */


}
