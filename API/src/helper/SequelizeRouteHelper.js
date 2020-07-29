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


    static getInstanceAssociationRoute(model,modelAssociationName){
        let instanceRoute = SequelizeRouteHelper.getInstanceRoute(model);
        let associationRoute = instanceRoute+"/"+modelAssociationName;
        return associationRoute;
    }

}
