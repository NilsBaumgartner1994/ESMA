import SequelizeHelper from "./SequelizeHelper";
import MyExpressRouter from "../module/MyExpressRouter";

export default class SequelizeRouteHelper {

    /**
     * Get the identifier of the primary key identifier of the model
     * @param model the sequelize model
     * @param primaryKeyAttribute the specific primary key
     * @return {string} a unique composition of modelname and primary key
     */
    static getModelPrimaryKeyAttributeParameter(model,primaryKeyAttribute){
        //we need the tablename, otherwise it would be ambigous for example UserRoles and UserFriends
        return SequelizeHelper.getTableName(model)+"_"+primaryKeyAttribute;
    }

    static getSchemeRoute(model){
        let tableName = SequelizeHelper.getTableName(model);
        return MyExpressRouter.routeSchemes + "/" + tableName;
    }

    /**
     * Get the Index route for a model
     * @param model the sequelize model
     * @return {string} api uri to the index
     */
    static getIndexRoute(model){
        let tableName = SequelizeHelper.getTableName(model);
        return MyExpressRouter.routeModels + "/" + tableName;
    }

    /**
     * Get the GET route for model
     * @param model the sequelize model
     * @return {string} the api uri to the resource
     */
    static getInstanceRoute(model){
        let route = SequelizeRouteHelper.getIndexRoute(model); // get the index route

        let primaryKeyAttributes = SequelizeHelper.getPrimaryKeyAttributes(model); // lets get all primary keys
        for(let i=0; i<primaryKeyAttributes.length; i++){ //for every primary key
            let primaryKeyAttribute = primaryKeyAttributes[i];
            route+="/:"+SequelizeRouteHelper.getModelPrimaryKeyAttributeParameter(model,primaryKeyAttribute); //we add it to the route
        }

        return route;
    }

    static getModelRoutes(model){
        let getRoute = SequelizeRouteHelper.getInstanceRoute(model); // get the GET route
        let indexRoute = SequelizeRouteHelper.getIndexRoute(model);
        let routes = {
            "GET": getRoute,
            "INDEX": indexRoute
        };
        return routes;
    }

    static getAllModelRoutes(models){
        let allModelRoutes = {};

        let modelList = SequelizeHelper.getModelList(models); //first get all models
        for(let i=0; i<modelList.length; i++) { //for every model
            let model = modelList[i];
            let modelRoutes = SequelizeRouteHelper.getModelRoutes(model);
            let tableName = SequelizeHelper.getTableName(model);
            allModelRoutes[tableName] = modelRoutes;
        }
        return allModelRoutes;
    }


    static getInstanceAssociationRoute(model,modelAssociationName){
        let instanceRoute = SequelizeRouteHelper.getInstanceRoute(model);
        let associationRoute = instanceRoute+"/"+modelAssociationName;
        return associationRoute;
    }

}
