import HttpStatus from "http-status-codes";
import MyExpressRouter from "../module/MyExpressRouter";
import SequelizeHelper from "../helper/SequelizeHelper";
import SequelizeRouteHelper from "../helper/SequelizeRouteHelper";
import DefaultControllerHelper from "../helper/DefaultControllerHelper";

export default class SequelizeSchemeController {

    constructor(logger, models, expressApp, myAccessControl, myExpressRouter) {
        this.logger = logger;
        this.models = models;
        this.expressApp = expressApp;
        this.myAccessControl = myAccessControl;
        this.myExpressRouter = myExpressRouter;
        this.functionsForModels = {};
        this.configureRoutes();
    }

    configureRoutes() {
        this.configureModelSchemesIndex();

        let modelList = SequelizeHelper.getModelList(this.models); //first get all models
        for(let i=0; i<modelList.length; i++) { //for every model
            let model = modelList[i];
            this.configureModelSchemeRoute(model); //configure routes for the model
            this.configureModelSchemeAssociationsRoute(model);
            this.configureModelSchemeRoutesRoute(model);
        }
    }

    configureModelSchemesIndex(){
        const grants = this.myAccessControl.getGrants();
        const tableNames = SequelizeHelper.getModelTableNames(this.models);

        let functionForModel = function(req, res){
            let modelsWithPermission = Object.keys(grants[req.locals.current_user.role]);
            let intersection = tableNames.filter(x => modelsWithPermission.includes(x));
            MyExpressRouter.responseWithJSON(res, HttpStatus.OK, intersection);
        }

        this.expressApp.get(MyExpressRouter.routeSchemes, functionForModel.bind(this)); // register route in express
    }

    configureModelSchemeRoute(model){
        let route = SequelizeRouteHelper.getSchemeRoute(model);
        let tableName = SequelizeHelper.getTableName(model);

        let functionForModel = function(req, res){
            let rawAttributes = SequelizeHelper.getModelAttributes(model);

            let permission = DefaultControllerHelper.getPermission(req,this.myAccessControl,tableName,"read",false);
            if (permission.granted) {
                let fileteredDataJSON = permission.filter(rawAttributes);
                MyExpressRouter.responseWithJSON(res, HttpStatus.OK, fileteredDataJSON);
            } else {
                MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                    errorCode: HttpStatus.FORBIDDEN,
                    error: 'Forbidden to read Resource',
                    "scheme": tableName
                });

            }
        }

        this.expressApp.get(route, functionForModel.bind(this)); // register route in express
    }

    configureModelSchemeAssociationsRoute(model){
        let route = SequelizeRouteHelper.getSchemeRoute(model)+"/associations";
        const tableAssociations = SequelizeHelper.getAssociationForModelJSON(model);
        const grants = this.myAccessControl.getGrants();

        let functionForModel = function(req, res){
            let modelsWithPermission = Object.keys(grants[req.locals.current_user.role]);
            let filteredDataList = [];

            for(let j=0; j<tableAssociations.length; j++) {
                let associationObject = tableAssociations[j];
                let modelAssociationObjects = Object.keys(associationObject);
                let modelAssociationName = modelAssociationObjects[0];

                let pluralName = associationObject[modelAssociationName]["name"]["plural"];
                if(modelsWithPermission.includes(pluralName)){
                    filteredDataList.push(modelAssociationName);
                }
            }

            MyExpressRouter.responseWithJSON(res, HttpStatus.OK, filteredDataList);
        }

        this.expressApp.get(route, functionForModel.bind(this)); // register route in express
    }

    configureModelSchemeRoutesRoute(model){
        let route = SequelizeRouteHelper.getSchemeRoute(model)+"/routes";
        let getRoute = SequelizeRouteHelper.getInstanceRoute(model); // get the GET route
        let routes = {
            "GET": getRoute
        };

        let functionForModel = function(req, res){
            MyExpressRouter.responseWithJSON(res, HttpStatus.OK, routes);
        }

        this.expressApp.get(route, functionForModel.bind(this)); // register route in express
    }



}
