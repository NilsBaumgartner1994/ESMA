import HttpStatus from "http-status-codes";
import MyExpressRouter from "../module/MyExpressRouter";
import SequelizeHelper from "../helper/SequelizeHelper";
import SequelizeRouteHelper from "../helper/SequelizeRouteHelper";

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
        for(let j=0; j<tableAssociations.length; j++){
            let associationObject = tableAssociations[j];
            let modelAssociationObjects = Object.keys(associationObject);
            let modelAssociationName = modelAssociationObjects[0];
            //console.log("--".repeat(level)+" "+modelAssociationName);

            let pluralName = associationObject[modelAssociationName]["name"]["plural"];

            let isPlural = pluralName === modelAssociationName;
            this.configureModelGetAssociationRoute(model,pluralName,modelAssociationName,isPlural);
        }
    }

    configureModelGetAssociationRoute(model,pluralName,modelAssociationName,isPlural){
        let associationRoute = SequelizeRouteHelper.getInstanceAssociationRoute(model,modelAssociationName);
        let associationGetFunction = "get"+modelAssociationName;
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
                console.log("associationGetFunction: "+associationGetFunction);

                let resource = req.locals[tableName];
                console.log(resource);
                req.locals[modelAssociationName] = await resource[associationGetFunction]();
                await SequelizeController.setOwningState(req,modelAssociationName);

                console.log("Now Pass default Controller Helper");

                this.myExpressRouter.defaultControllerHelper.handleGet(req, res, this.myAccessControl, pluralName, modelAssociationName, SequelizeController.getOwningState(req,tableName));
            }
        }

        this.expressApp.get(associationRoute, functionForModel.bind(this)); // register route in express
    }

}
