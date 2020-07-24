import HttpStatus from "http-status-codes";
import MyExpressRouter from "../module/MyExpressRouter";
import SequelizeHelper from "../helper/SequelizeHelper";

export default class SequelizeController {

    constructor(logger, models, expressApp, myAccessControl, myExpressRouter) {
        this.logger = logger;
        this.models = models;
        this.expressApp = expressApp;
        this.myAccessControl = myAccessControl;
        this.myExpressRouter = myExpressRouter;
        this.functionsForModels = {};
    }

    /**
     * Configure all Routes for the database
     */
    configureRoutes() {
        let modelJSON = SequelizeHelper.getModelJSON(this.models); //first get all models
        let modelNames = Object.keys(modelJSON); //get the names
        for(let i=0; i<modelNames.length; i++) { //for every model
            let modelName = modelNames[i];
            let model = modelJSON[modelName];
            this.configModelRoutes(model); //configure routes for the model
            this.printAllAssociations(model);
        }
    }

    printAllAssociations(model, level=1, maxLevel=2){
        let tableAssociations = SequelizeHelper.getAssociationForModelJSON(model);
        for(let j=0; j<tableAssociations.length; j++){
            let associationObject = tableAssociations[j];
            let modelObjects = Object.keys(associationObject);
            let modelName = modelObjects[0];
            console.log("--".repeat(level)+" "+modelName);
        }
    }

    /**
     * Configure all routes for a model
     * @param model the given sequelize moodel
     */
    configModelRoutes(model){
        this.configureIndex(model); //configure the index route
        this.configureGet(model); //configure the get route
        this.configurePrimaryParamsChecker(model); //configure the params for identifing the resource
    }

    saveFunctionForModel(model, functionForModel, functionName){
        let tableName = SequelizeHelper.getTableName(model);
        let functionsForModel = this.functionsForModels[tableName] || {};
        functionsForModel[functionName] = functionForModel;
        this.functionsForModels[tableName] = functionsForModel;
    }

    /**
     * Get the Index route for a model
     * @param model the sequelize model
     * @return {string} api uri to the index
     */
    getIndexRoute(model){
        let tableName = SequelizeHelper.getTableName(model);
        return MyExpressRouter.urlAPI + "/" + tableName;
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

        let route = this.getIndexRoute(model); //get the index route
        this.expressApp.get(route, functionForModel.bind(this)); //register route in express
        this.saveFunctionForModel(model, functionForModel, "Index"); //save the index function
    }

    /**
     * Get the GET route for model
     * @param model the sequelize model
     * @return {string} the api uri to the resource
     */
    getInstanceRoute(model){
        let route = this.getIndexRoute(model); // get the index route

        let primaryKeyAttributes = SequelizeHelper.getPrimaryKeyAttributes(model); // lets get all primary keys
        for(let i=0; i<primaryKeyAttributes.length; i++){ //for every primary key
            let primaryKeyAttribute = primaryKeyAttributes[i];
            route+="/:"+this.getModelPrimaryKeyAttributeParameter(model,primaryKeyAttribute); //we add it to the route
        }

        return route;
    }

    /**
     * Configure the GET Route for a model
     * @param model the sequelize model
     */
    configureGet(model){
        let tableName = SequelizeHelper.getTableName(model);

        let functionForModel = function(req, res){ //define the get function
            //just call the default GET
            this.myExpressRouter.defaultControllerHelper.handleGet(req, res, this.myAccessControl, tableName, tableName, req.locals["own"+tableName]);
        }

        let route = this.getInstanceRoute(model); // get the GET route
        this.expressApp.get(route, functionForModel.bind(this)); // register route in express
        this.saveFunctionForModel(model, functionForModel, "Get"); //save the get function
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
     * Get the identifier of the primary key identifier of the model
     * @param model the sequelize model
     * @param primaryKeyAttribute the specific primary key
     * @return {string} a unique composition of modelname and primary key
     */
    getModelPrimaryKeyAttributeParameter(model,primaryKeyAttribute){
        return SequelizeHelper.getTableName(model)+"_"+primaryKeyAttribute;
    }

    /**
     * Configure a primary param checker
     * @param model
     * @param primaryKeyAttribute
     */
    configurePrimaryParamChecker(model, primaryKeyAttribute){
        // get the identifier
        let modelPrimaryKeyAttributeParameter = this.getModelPrimaryKeyAttributeParameter(model,primaryKeyAttribute);
        // link identifier to paramchecker
        this.expressApp.param(modelPrimaryKeyAttributeParameter, this.paramPrimaryParamChecker.bind(this,primaryKeyAttribute,model));
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
                }
                next();
            }
        }).catch(err => { //handle error
            this.logger.error("[DefaultControllerHelper] paramcheckerResourceId - " + err.toString());
            MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
        });
    };

}
