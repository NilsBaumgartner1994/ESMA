import HttpStatus from "http-status-codes";
import MyExpressRouter from "../module/MyExpressRouter";
import SequelizeHelper from "../helper/SequelizeHelper";
import SequelizeRouteHelper from "../helper/SequelizeRouteHelper";

export default class SequelizeController {

    constructor(logger, models, expressApp, myAccessControl, myExpressRouter) {
        this.logger = logger;
        this.models = models;
        this.expressApp = expressApp;
        this.myAccessControl = myAccessControl;
        this.myExpressRouter = myExpressRouter;
        this.functionsForModels = {};
        this.configureRoutes();
    }

    /**
     * Configure all Routes for the database
     */
    configureRoutes() {
        let modelList = SequelizeHelper.getModelList(this.models); //first get all models
        for(let i=0; i<modelList.length; i++) { //for every model
            let model = modelList[i];

            this.configureModelRoutes(model); //configure routes for the model
            this.configureModelAssociationRoutes(model);
        }
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
            let associationRoute = SequelizeRouteHelper.getInstanceAssociationRoute(model,modelAssociationName);
            let associationGetFunction = "get"+modelAssociationName;

            let functionForModel = null;
            if(isPlural){
                functionForModel = async function(req, res){ //define the get function
                    //just call the default GET
                    console.log("Handle INDEX Association Request");

                    let tableName = SequelizeHelper.getTableName(model);
                    let resource = req.locals[tableName];

                    this.myExpressRouter.defaultControllerHelper.handleAssociationIndex(req,res,resource,this.myAccessControl,pluralName,pluralName,associationGetFunction);
                }
            } else {
                functionForModel = async function(req, res){ //define the get function
                    //just call the default GET
                    console.log("Handle GET Association Request");

                    let tableName = SequelizeHelper.getTableName(model);
                    let resource = req.locals[tableName];
                    req.locals[modelAssociationName] = await resource[associationGetFunction]();
                    await SequelizeController.setOwningState(req,modelAssociationName);

                    this.myExpressRouter.defaultControllerHelper.handleGet(req, res, this.myAccessControl, pluralName, modelAssociationName, SequelizeController.getOwningState(req,tableName));
                }
            }

            this.expressApp.get(associationRoute, functionForModel.bind(this)); // register route in express
        }
    }

    /**
     * Configure all routes for a model
     * @param model the given sequelize moodel
     */
    configureModelRoutes(model){
        this.configureIndex(model); //configure the index route
        this.configureGet(model); //configure the get route
        this.configureDelete(model);
        this.configureUpdate(model);
        this.configurePrimaryParamsChecker(model); //configure the params for identifing the resource
    }

    /**
     * Configure the Index Route for a model
     * @param model the sequelize model
     */
    configureIndex(model){
        let tableName = SequelizeHelper.getTableName(model);

        let functionForModel = function(req, res) { //define the index function
            //just call the default index
            this.myExpressRouter.defaultControllerHelper.handleIndex(req, res, model, this.myAccessControl, tableName, tableName);
        }

        let route = SequelizeRouteHelper.getIndexRoute(model); //get the index route
        this.expressApp.get(route, functionForModel.bind(this)); //register route in express
    }

    /**
     * Configure the GET Route for a model
     * @param model the sequelize model
     */
    configureGet(model){
        let tableName = SequelizeHelper.getTableName(model);

        let functionForModel = function(req, res){ //define the get function
            //just call the default GET
            this.myExpressRouter.defaultControllerHelper.handleGet(req, res, this.myAccessControl, tableName, tableName, SequelizeController.getOwningState(req,tableName));
        }

        let route = SequelizeRouteHelper.getInstanceRoute(model); // get the GET route
        console.log(route);
        this.expressApp.get(route, functionForModel.bind(this)); // register route in express
    }

    /**
     * Configure the DELETE Route for a model
     * @param model the sequelize model
     */
    configureDelete(model){
        let tableName = SequelizeHelper.getTableName(model);

        let functionForModel = function(req, res){ //define the get function
            //just call the default DELETE
            this.myExpressRouter.defaultControllerHelper.handleDelete(req, res, this.myAccessControl, tableName, tableName, SequelizeController.getOwningState(req,tableName));
        }

        let route = SequelizeRouteHelper.getInstanceRoute(model); // get the GET route
        this.expressApp.delete(route, functionForModel.bind(this)); // register route in express
    }

    /**
     * Configure the Update Route for a model
     * @param model the sequelize model
     */
    configureUpdate(model){
        let tableName = SequelizeHelper.getTableName(model);

        let functionForModel = function(req, res){ //define the get function
            //just call the default UPDATE
            this.myExpressRouter.defaultControllerHelper.handleUpdate(req, res, this.myAccessControl, tableName, tableName, SequelizeController.getOwningState(req,tableName));
        }

        let route = SequelizeRouteHelper.getInstanceRoute(model); // get the GET route
        this.expressApp.post(route, functionForModel.bind(this)); // register route in express
    }

    /**
     * Configure the primary params checker
     * @param model the sequelize model
     */
    configurePrimaryParamsChecker(model){
        let primaryKeyAttributes = SequelizeHelper.getPrimaryKeyAttributes(model); // get primary key attributes
        for(let i=0; i<primaryKeyAttributes.length; i++){ //for every primary key
            let primaryKeyAttribute = primaryKeyAttributes[i];
            this.configurePrimaryParamChecker(model,primaryKeyAttribute); //configure param checker
        }
    }

    /**
     * Configure a primary param checker
     * @param model
     * @param primaryKeyAttribute
     */
    configurePrimaryParamChecker(model, primaryKeyAttribute){
        // get the identifier
        let modelPrimaryKeyAttributeParameter = SequelizeRouteHelper.getModelPrimaryKeyAttributeParameter(model,primaryKeyAttribute);
        // link identifier to paramchecker
        this.expressApp.param(modelPrimaryKeyAttributeParameter, this.paramPrimaryParamChecker.bind(this,primaryKeyAttribute,model));
    }

    static async evalOwningState(req,resource){
        try{
            //check if there is an owning function
            return await resource.isOwn(req.locals.current_user);
        } catch(err) {
            return false; //if not, then we dont care
        }
    }

    static async setOwningState(req,tableName){
        req.locals["own"+tableName] = await SequelizeController.evalOwningState(req,req.locals[tableName]);
    }

    static getOwningState(req,tableName){
        return req.locals["own"+tableName];
    }

    /**
     * Primary param checker
     * @param primaryKeyAttribute the key attribute name
     * @param model the sequelize model
     * @param req the request
     * @param res the response
     * @param next the next middleware
     * @param primaryKeyAttributeValue the primary key value to check
     */
    paramPrimaryParamChecker(primaryKeyAttribute, model, req, res, next, primaryKeyAttributeValue) {
        let tableName = SequelizeHelper.getTableName(model);

        // define a search clause for the model
        let searchJSON = req.locals.searchJSON || {}; // get or init
        let modelSearchJSON = searchJSON[tableName] || {}; // get for model
        modelSearchJSON[primaryKeyAttribute] = primaryKeyAttributeValue; // set search param
        searchJSON[tableName] = modelSearchJSON; // save for model
        req.locals.searchJSON = searchJSON; // save in locals for later use

        //we search for all, since there are maybe multiple primary keys
        model.findAll({where: modelSearchJSON}).then(async resources => {
            if(!resources || resources.length === 0){ //if no resources found
                MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, { //response with error
                    error: 'No Resource found',
                    model: tableName,
                    key: primaryKeyAttribute,
                    value: primaryKeyAttributeValue
                });
                return;
            } else { // resource was found
                if(resources.length===1){ //exactly one was found
                    req.locals[tableName] = resources[0]; //save the found resource
                    await SequelizeController.setOwningState(req,tableName);
                }
                next();
            }
        }).catch(err => { //handle error
            this.logger.error("[SequelizeController] paramPrimaryParamChecker - " + err.toString());
            MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
        });
    };

}
