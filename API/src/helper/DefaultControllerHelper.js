import HttpStatus from "http-status-codes";
import MyExpressRouter from "../module/MyExpressRouter";
const { Op } = require('sequelize');

const {
    performance
} = require('perf_hooks');


const redisCacheTime = 2 * 60; //Amount of Seconds often requests will use the cache before accessing the database

/**
 * The DefaultControllerHelper provides the default CRUD Functions for Resources. It also provides some default permisssion filtering functions. This class is mostly used by all controllers
 */
export default class DefaultControllerHelper {

    static CRUD_CREATE = "create";
    static CRUD_READ = "read";
    static CRUD_UPDATE = "update";
    static CRUD_DELETE = "delete";

    /**
     * The Constructor of the DefaultControllerHelper
     * @param logger The Logger informations will be send to
     * @param models The models of the Database
     * @param myExpressRouter The ExpressRouter Wrapper
     */
    constructor(logger, models, myExpressRouter) {
        this.logger = logger;
        this.models = models;
        this.myExpressRouter = myExpressRouter;
    }

    /**
     * Since there exists a TableUpdateTimes Table which records the dates at which other tables where updated at, this function helps to update the entry for a given table.
     * @param tableName The table name which should be known to be updated
     * @param models The models
     * @param workerID The workerId which will be used for error logging
     * @param logger The logger which will be used to log
     * @returns {Promise<void>}
     */
    static async updateTableUpdateTimesByTableNameAndModels(tableName, models, workerID, logger) {
        try {
            let resource = await models.TableUpdateTimes.findOne({where: {tableName: tableName}}); //find the table
            if (!!resource) { //if unkown tablename in tableupdatetimes
                resource.changed('updatedAt', true);
                resource.save();
            } else {
                resource = models.TableUpdateTimes.build({tableName: tableName}); //create it
                await resource.save(); //save it
            }
        } catch (err) {
            logger.error("[" + workerID + "][DefaultControllerHelper] updateTableUpdateTimes - " + err.toString());
        }
    }


    /**
     * Get a Sequelize Resource as JSON
     * @param resource the sequelize resource
     * @returns {*}
     */
    static getResourceAsJSON(resource){
        return resource.get({plain: true});
    }

    /**
     * Filter List of Resources. Remove Attributes which are not permitted by the permission
     * @param resources List of Resources
     * @param permission The permission
     * @returns [{*}] List of Json object of the filtered resources
     */
    static filterResourcesWithPermission(resources, permission) {
        let dataJSON = resources.map((resource) => //for every item
            DefaultControllerHelper.filterResourceWithPermission(resource, permission)); //lets filter them
        return dataJSON;
    }

    /**
     * Filter single Resource. Remove Attributes which are not permitted by the permission
     * @param resource The resource
     * @param permission The permission
     * @returns {*} JSOB Object with filtered attributes
     */
    static filterResourceWithPermission(resource, permission) {
        let dataJSON = permission.filter(DefaultControllerHelper.getResourceAsJSON(resource)); //get the json resource, then filter
        return dataJSON;
    }

    /**
     * Filter List of Resources and Respond to a Request With a Success.
     * @param req The request object
     * @param res The response object
     * @param resources The list of resources
     * @param permission The permission
     */
    static respondWithPermissionFilteredResources(req, res, resources, permission) {
        let fileteredDataJSON = DefaultControllerHelper.filterResourcesWithPermission(resources, permission); //filter data
        MyExpressRouter.responseWithJSON(res, HttpStatus.OK, fileteredDataJSON);
    }

    /**
     * Filter a single Resources and Respond to a Request With a Success.
     * @param req The request object
     * @param res The response object
     * @param resource The resource
     * @param permission The permission
     */
    static respondWithPermissionFilteredResource(req, res, resource, permission) {
        let fileteredDataJSON = DefaultControllerHelper.filterResourceWithPermission(resource, permission); //filter data
        MyExpressRouter.responseWithJSON(res, HttpStatus.OK, fileteredDataJSON);
    }

    /**
     * Response a Request with the default Message for a deletion of a resource
     * @param req The request object
     * @param res The response object
     */
    static respondWithDeleteMessage(req, res) {
        MyExpressRouter.responseWithJSON(res, HttpStatus.OK, {success: true});
    }

    /**
     * Response a Request with the default Message for a deletion of a resource
     * @param req The request object
     * @param res The response object
     */
    static respondWithInternalErrorMessage(req, res, err) {
        MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {
            errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: err.toString()
        });
    }

    static respondWithForbiddenMessage(req,res,reason){
        MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
            errorCode: HttpStatus.FORBIDDEN,
            error: 'Forbidden: ' + reason
        });
    }

    /**
     *
     * @param sequelizeModel
     * @param updateTableUpdateTimes
     * @returns {Promise<void>}
     */
    async updateTableUpdateTimes(sequelizeModel, updateTableUpdateTimes) {
        if (updateTableUpdateTimes) { //if we should update the table update times
            let tableName = sequelizeModel.name; //get the table name of the model
            await this.updateTableUpdateTimesByTableName(tableName); //update
        }
    }

    /**
     * Update the the table name in table update times
     * @param tableName The tablename
     * @returns {Promise<void>}
     */
    async updateTableUpdateTimesByTableName(tableName) {
        await DefaultControllerHelper.updateTableUpdateTimesByTableNameAndModels(tableName, this.models, this.myExpressRouter.workerID, this.logger);
    }

    /**
     * Parse Operators if content is provided
     * TODO write documentation for this: example ... streamviews?createdAt={"gte":"2020-06-05T08:19:31.000Z"}
     * https://sequelize.org/v5/manual/querying.html#operators-aliases
     */
    parseOperatorContent(queryFiltered){
        let queryFilteredKeys = Object.keys(queryFiltered); //for all available keys
        for(let i=0; i<queryFilteredKeys.length;i++){
            let key = queryFilteredKeys[i]; //get key like "id"
            let content = queryFiltered[key];
            if(!!content && content.startsWith("{") && content.endsWith("}")){ //check if we have search params
                let parsedContent = JSON.parse(content); //well then parse it
		        let operatorKeys = Object.keys(parsedContent); //get all keys like: greater than: gte
                for(let j=0; j<operatorKeys.length; j++){ //for all operators
                    let operator = operatorKeys[i];
                    parsedContent[Op[operator]] = parsedContent[operator]; //replace specific operator
                    delete parsedContent[operator]; //delete old string "operator"
                }
                queryFiltered[key] = parsedContent; //save
            }
        }
        return queryFiltered;
    }


    /**
     * Routes
     */

    getSequelizeQuery(req,permission,includeModels){
        let queryCopy = JSON.parse(JSON.stringify(req.query)); //create a copy on that we work
        delete queryCopy.limit;
        delete queryCopy.order;
        let queryFiltered = permission.filter(queryCopy); //filter all now allowed query variables
        queryFiltered = this.parseOperatorContent(queryFiltered);
        //console.log("queryFiltered:");
        //console.log(JSON.stringify(queryFiltered));

        let sequelizeQuery = {include: includeModels, where: queryFiltered};

        if(req.query.limit){ //check for limit
            sequelizeQuery.limit = parseInt(req.query.limit);
        }
        if(req.query.order){ //check for order
            sequelizeQuery.order = JSON.parse(req.query.order);
        }
        return sequelizeQuery;
    }

    static isQueryInRequest(req){
        let queryKeyLength = Object.keys(req.query).length;
        return queryKeyLength !== 0;
    }

    async handleAssociationIndex(req,res,sequelizeModel,myAccessControl,accessControlResource,resourceName,functionNameToCall,isOwn,includeModels = []){
        let permission = DefaultControllerHelper.getPermission(req,myAccessControl,accessControlResource,DefaultControllerHelper.CRUD_READ,isOwn);
        if(permission.granted){
            let sequelizeQuery = this.getSequelizeQuery(req,permission,includeModels);

            sequelizeModel[functionNameToCall](sequelizeQuery).then(resources => { //get resources
                let dataJSON = DefaultControllerHelper.filterResourcesWithPermission(resources, permission); //filter
                this.logger.info("[DefaultControllerHelper] handleAssociationIndex - " + resourceName);
                MyExpressRouter.responseWithJSON(res, HttpStatus.OK, dataJSON); //anyway answer normaly
            }).catch(err => {
                this.logger.error("[DefaultControllerHelper] handleAssociationIndex - " + resourceName + " - " + err.toString());
                DefaultControllerHelper.respondWithInternalErrorMessage(req,res,err);

            });
        } else {
            DefaultControllerHelper.respondWithForbiddenMessage(req,res,"Index "+resourceName);
        }
    }

    /**
     * Default Function to Handle Index Requests for Resources.
     * @param req The request object
     * @param res The resonse object
     * @param sequelizeModel The Model we want to make an index
     * @param myAccessControl The Access Control
     * @param accessControlResource The resource name for checking in the access control
     * @param resourceName The resource name for logging
     * @param includeModels Optional include models which should be added too. Beware ! No Permission filtering for these
     * @param redisKey Optional a Redis Key, for to look up in cache.
     * @param customPermission use custom permission instead
     * @returns {Promise<Promise<* | *>|*>}
     *
     * @apiDefine DefaultControllerIndex
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR
     * @apiError (Error) {String} error A description of the error
     */
    async handleIndex(req, res, sequelizeModel, myAccessControl, accessControlResource, includeModels = [], redisKey, customPermission) {
        let permission = DefaultControllerHelper.getPermission(req,myAccessControl,accessControlResource,DefaultControllerHelper.CRUD_READ,false);
        if(!!customPermission){
            permission = customPermission;
        }
        if (permission.granted) { //can you read any of this resource ?
            console.log("HandleIndex permitted");
            if(!!redisKey & !DefaultControllerHelper.isQueryInRequest(req)){
                let redisClient = MyExpressRouter.redisClient; //get the client
                let role = req.locals.current_user.role; //get users role

                redisClient.get(role + ":" + redisKey, (err, cachedStringData) => { //search in cache
                    if (!!cachedStringData) { //if something saved in cache
                        let dataJSON =  JSON.parse(cachedStringData); //parse to json
                        this.logger.info("[DefaultControllerHelper] handleIndex - " + accessControlResource + " found in cache for role: " + role);
                        MyExpressRouter.responseWithJSON(res, HttpStatus.OK, dataJSON);

                    } else { //not found in cache, then lets look it up
                        sequelizeModel.findAll({include: includeModels}).then(resources => { //get resources
                            let dataJSON = DefaultControllerHelper.filterResourcesWithPermission(resources, permission); //filter
                            redisClient.setex(role + ":" + redisKey, redisCacheTime, JSON.stringify(dataJSON)); //save in cahce
                            this.logger.info("[DefaultControllerHelper] handleIndex - " + accessControlResource + " not found in cache for role: " + role);
                            MyExpressRouter.responseWithJSON(res, HttpStatus.OK, dataJSON); //anyway answer normaly

                        }).catch(err => {
                            this.logger.error("[DefaultControllerHelper] handleIndex - " + accessControlResource + " found in cache for role: " + role + " - " + err.toString());
                            DefaultControllerHelper.respondWithInternalErrorMessage(req,res,err);
                        });
                    }
                });
            } else {
                let sequelizeQuery = this.getSequelizeQuery(req,permission,includeModels);

                //lets find all resources with query
                sequelizeModel.findAll(sequelizeQuery).then(resources => {
                    //console.log(resources);
                    this.logger.info("[DefaultControllerHelper] handleIndex - " + accessControlResource + " with query: " + JSON.stringify(req.query));
                    //console.log("[DefaultControllerHelper] handleIndex found: "+resources.length);
                    DefaultControllerHelper.respondWithPermissionFilteredResources(req, res, resources, permission);
                }).catch(err => {
                    this.logger.error("[DefaultControllerHelper] handleIndex - " + accessControlResource + " with query: " + JSON.stringify(req.query) + " - " + err.toString());
                    DefaultControllerHelper.respondWithInternalErrorMessage(req,res,err);
                });
            }
        } else {
            DefaultControllerHelper.respondWithForbiddenMessage(req,res,"Get "+accessControlResource);

        }
    }

    /**
     * Default Create Method to build a resource, which primary key is a ID.
     * @param req The request object
     * @param res The resonse object
     * @param sequelizeResource The pre build resource
     * @param myAccessControl The Access Control
     * @param accessControlResource The resource name for checking in the access control
     * @param resourceName The resource name for logging
     * @param isOwn if the current_user owns the resource
     * @param updateTableUpdateTimes Boolean if the table update times should be updated
     * @returns {Promise<void>}
     *
     * @apiDefine DefaultControllerCreate
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR
     * @apiError (Error) {String} error A description of the error
     */
    async handleCreate(req, res, sequelizeResource, myAccessControl, accessControlResource, updateTableUpdateTimes = false, customAnswer=false) {
        console.log("DefaultHandler handleCreate");
        let isOwn = DefaultControllerHelper.getOwningState(req,accessControlResource);
        console.log("is own: "+isOwn);
        let permission = DefaultControllerHelper.getPermission(req,myAccessControl,accessControlResource,DefaultControllerHelper.CRUD_CREATE,isOwn);

        this.logger.info("[" + this.myExpressRouter.workerID + "][DefaultControllerHelper] handleCreate - " + accessControlResource + " current_user: " + req.locals.current_user.id + " granted: " + permission.granted);
        if (permission.granted) { //check if allowed to create the resource
            console.log("permission granted");
            return sequelizeResource.save().then(savedResource => { //save resource, this will generate ids and other stuff
                req.locals[accessControlResource] = savedResource;
                if(!customAnswer){
                    this.handleGet(req, res, myAccessControl, accessControlResource);
                }
                this.updateTableUpdateTimes(sequelizeResource.constructor, updateTableUpdateTimes); //pass update check to function
                return savedResource;
            }).catch(err => {
                console.log(err);
                this.logger.error("[" + this.myExpressRouter.workerID + "][DefaultControllerHelper] handleCreate - " + err.toString());
                DefaultControllerHelper.respondWithInternalErrorMessage(req,res,err);
                return null;
            });
        } else {
            DefaultControllerHelper.respondWithForbiddenMessage(req,res,"Create "+accessControlResource);
            return null;
        }
    }

    static async evalOwningState(req,resource){
        try{
            //check if there is an owning function
            return await resource.isOwn(req.locals.current_user);
        } catch(err) {
            return false; //if not, then we dont care
        }
    }

    static async setOwningStateForResource(req,tableName,resource){
        req.locals["own"+tableName] = await DefaultControllerHelper.evalOwningState(req,resource);
    }

    static async setOwningState(req,tableName){
        await DefaultControllerHelper.setOwningStateForResource(req,tableName,req.locals[tableName]);
    }

    static getOwningState(req,tableName){
        return req.locals["own"+tableName];
    }

    /**
     * Default Get Method for a single resource
     * @param req The request object
     * @param res The resonse object
     * @param myAccessControl The Access Control
     * @param accessControlResource The resource name for checking in the access control
     * @param resourceName The resource name for logging
     * @param isOwn if the current_user owns the resource
     * @returns {Promise<void>}
     *
     * @apiDefine DefaultControllerGet
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: FORBIDDEN, NOT_FOUND
     * @apiError (Error) {String} error A description of the error
     */
    async handleGet(req, res, myAccessControl, accessControlResource) {
        let sequelizeResource = req.locals[accessControlResource]; //get the found resource, found by paramcheckers
        if(!sequelizeResource){
            MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {
                error: 'No Resource found',
                model: accessControlResource
            });
            return;
        }

        let isOwn = DefaultControllerHelper.getOwningState(req,accessControlResource);
        let permission = DefaultControllerHelper.getPermission(req,myAccessControl,accessControlResource,DefaultControllerHelper.CRUD_READ,isOwn);
        if (permission.granted) { //can read/get resource
            DefaultControllerHelper.respondWithPermissionFilteredResource(req, res, sequelizeResource, permission);
        } else {
            DefaultControllerHelper.respondWithForbiddenMessage(req,res,"Get "+accessControlResource);
        }
    }

    static getFilteredReqBodyByPermission(req,myAccessControl,accessControlResource,crudOperation, isOwn){
        let permission = DefaultControllerHelper.getPermission(req,myAccessControl,accessControlResource,crudOperation,isOwn);
        return permission.filter(req.body); //get Attributes with permission
    }

    /**
     * Default Update Method for a Resource.
     * @param req The request object
     * @param res The resonse object
     * @param myAccessControl The Access Control
     * @param accessControlResource The resource name for checking in the access control
     * @param resourceName The resource name for logging
     * @param isOwn if the current_user owns the resource
     * @param updateTableUpdateTimes Boolean if the table update times should be updated
     * @returns {Promise<void>}
     *
     *
     * @apiDefine DefaultControllerUpdate
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND
     * @apiError (Error) {String} error A description of the error
     */
    async handleUpdate(req, res, myAccessControl, accessControlResource, updateTableUpdateTimes = false) {
        let sequelizeResource = req.locals[accessControlResource]; //get the resource

        let isOwn = DefaultControllerHelper.getOwningState(req,accessControlResource);
        let permission = DefaultControllerHelper.getPermission(req,myAccessControl,accessControlResource,DefaultControllerHelper.CRUD_UPDATE,isOwn);
        this.logger.info("[" + this.myExpressRouter.workerID + "][DefaultControllerHelper] handleUpdate - " + accessControlResource + " current_user: " + req.locals.current_user.id + " granted: " + permission.granted);
        if (permission.granted) { //can update resource
            this.logger.info("[" + this.myExpressRouter.workerID + "][DefaultControllerHelper] handleUpdate - " + accessControlResource + " current_user:" + req.locals.current_user.id + " body: " + JSON.stringify(req.body));
            let allowedAttributesToUpdate = DefaultControllerHelper.getFilteredReqBodyByPermission(req,myAccessControl,accessControlResource,DefaultControllerHelper.CRUD_UPDATE, isOwn)
            this.logger.info("[" + this.myExpressRouter.workerID + "][DefaultControllerHelper] handleUpdate - " + accessControlResource + " current_user:" + req.locals.current_user.id + " allowedAttributesToUpdate: " + JSON.stringify(allowedAttributesToUpdate));
            sequelizeResource.update(allowedAttributesToUpdate).then((updatedResource) => { //update resource
                req.locals[accessControlResource] = updatedResource;
                this.handleGet(req, res, myAccessControl, accessControlResource);
                this.updateTableUpdateTimes(sequelizeResource.constructor, updateTableUpdateTimes);
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][DefaultControllerHelper] handleUpdate - " + err.toString());
                DefaultControllerHelper.respondWithInternalErrorMessage(req,res,err);
            });
        } else {
            DefaultControllerHelper.respondWithForbiddenMessage(req,res,"Update "+accessControlResource);

        }
    }


    /**
     * Default Delete Method of a Resource
     * @param req The request object
     * @param res The resonse object
     * @param myAccessControl The Access Control
     * @param accessControlResource The resource name for checking in the access control
     * @param resourceName The resource name for logging
     * @param isOwn if the current_user owns the resource
     * @param updateTableUpdateTimes Boolean if the table update times should be updated
     * @returns {Promise<void>}
     *
     * @apiDefine DefaultControllerDelete
     * @apiSuccess {Boolean} success On success this is true
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND
     * @apiError (Error) {String} error A description of the error
     */
    async handleDelete(req, res, myAccessControl, accessControlResource, updateTableUpdateTimes = false) {
	    //console.log("Helper handleDelete");
        let sequelizeResource = req.locals[accessControlResource]; //get the resource which should be deleted
    	//console.log("Found Resource: "+!!sequelizeResource);

        let isOwn = DefaultControllerHelper.getOwningState(req,accessControlResource);
        let permission = DefaultControllerHelper.getPermission(req,myAccessControl,accessControlResource,DefaultControllerHelper.CRUD_DELETE,isOwn);
        this.logger.info("[" + this.myExpressRouter.workerID + "][DefaultControllerHelper] handleDelete - " + accessControlResource + " current_user: " + req.locals.current_user.id + " granted: " + permission.granted);
        if (permission.granted) { //can delete resource
            let constructor = sequelizeResource.constructor; //get constructor for table update times
            sequelizeResource.destroy().then(amountDeletedResources => { //ignoring the amount of deletions
                DefaultControllerHelper.respondWithDeleteMessage(req, res);
                this.updateTableUpdateTimes(constructor, updateTableUpdateTimes);
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][DefaultControllerHelper] handleDelete - " + accessControlResource + " " + err.toString());
                DefaultControllerHelper.respondWithInternalErrorMessage(req,res,err);
            });
        } else {
            DefaultControllerHelper.respondWithForbiddenMessage(req,res,"Delete "+accessControlResource);
        }
    }

    static getPermission(req,myAccessControl,accessControlResource,crudOperation,isOwn=false){
        let permission = myAccessControl.can(req.locals.current_user.role)[crudOperation+"Any"](accessControlResource);
        if (isOwn) {
            permission = myAccessControl.can(req.locals.current_user.role)[crudOperation+"Own"](accessControlResource);
        }
        return permission;
    }
}
