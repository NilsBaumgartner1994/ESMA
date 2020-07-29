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
        console.log(DefaultControllerHelper.getResourceAsJSON(resource));
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
     * Default Paramchecker of a resource. Saves the found Resource req.locals[resourceName] and continues with next function. Or if not found it will response with not found error to req.
     * @param req The request object
     * @param res The response object
     * @param next The next funtion
     * @param resource_id The id of the resource
     * @param sequelizeModel The Sequelize Model
     * @param accessControlResource Not yet neeeded access control.
     * @param resourceName The name of the resource where it should be stored
     */
    paramcheckerResourceId(req, res, next, resource_id, sequelizeModel, accessControlResource, resourceName,functionForOwningResource) {
        this.logger.info("[DefaultControllerHelper] paramcheckerResourceId - " + resourceName + " resource_id: " + resource_id);
        sequelizeModel.findOne({where: {id: resource_id}}).then(async resource => {
            if (!resource) { //if resource was not found
                MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {
                    error: resourceName + '_id not found',
                    [resourceName + "_id"]: resource_id
                });
		return;
            } else { //resource was found
                req.locals[resourceName] = resource; //save the found resource
                if(!!functionForOwningResource){
                    let isOwn = await functionForOwningResource(req,resource);
                    req.locals[resourceName+"isOwn"] = isOwn;
                }
                next();
            }
        }).catch(err => { //handle error
            this.logger.error("[DefaultControllerHelper] paramcheckerResourceId - " + err.toString());
            MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
        });
    };

    /**
     * Parse Operators if content is provided
     * TODO write documentation for this: example ... streamviews?createdAt={"gte":"2020-06-05T08:19:31.000Z"}
     * https://sequelize.org/v5/manual/querying.html#operators-aliases
     */
    parseOperatorContent(queryFiltered){
	//console.log("parseOperatorContent");
        let queryFilteredKeys = Object.keys(queryFiltered); //for all available keys
        for(let i=0; i<queryFilteredKeys.length;i++){
            let key = queryFilteredKeys[i]; //get key like "id"
	    //console.log("key: "+key);
            let content = queryFiltered[key];
	    //console.log("content: "+content);
            if(!!content && content.startsWith("{") && content.endsWith("}")){ //check if we have search params
                let parsedContent = JSON.parse(content); //well then parse it
		let operatorKeys = Object.keys(parsedContent); //get all keys like: greater than: gte
		for(let j=0; j<operatorKeys.length; j++){ //for all operators
		    let operator = operatorKeys[i];
		    //console.log("operator: "+operator);
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

    isQueryInRequest(req){
        let queryKeyLength = Object.keys(req.query).length;
        return queryKeyLength !== 0;
    }

    async handleAssociationIndex(req,res,sequelizeModel,myAccessControl,accessControlResource,resourceName,functionNameToCall,isOwn,includeModels = []){
        let permission = DefaultControllerHelper.getPermission(req,myAccessControl,accessControlResource,"read",isOwn);
        if(permission.granted){
            let sequelizeQuery = this.getSequelizeQuery(req,permission,includeModels);

            sequelizeModel[functionNameToCall](sequelizeQuery).then(resources => { //get resources
                let dataJSON = DefaultControllerHelper.filterResourcesWithPermission(resources, permission); //filter
                this.logger.info("[DefaultControllerHelper] handleAssociationIndex - " + resourceName);
                MyExpressRouter.responseWithJSON(res, HttpStatus.OK, dataJSON); //anyway answer normaly
            }).catch(err => {
                this.logger.error("[DefaultControllerHelper] handleAssociationIndex - " + resourceName + " - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to get Resource: ' + resourceName
            });
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
    async handleIndex(req, res, sequelizeModel, myAccessControl, accessControlResource, resourceName, includeModels = [], redisKey, customPermission) {
        let permission = DefaultControllerHelper.getPermission(req,myAccessControl,accessControlResource,"read",false);
        if(!!customPermission){
            permission = customPermission;
        }
        if (permission.granted) { //can you read any of this resource ?
            if(!!redisKey & !this.isQueryInRequest(req)){
                let redisClient = MyExpressRouter.redisClient; //get the client
                let role = req.locals.current_user.role; //get users role

                redisClient.get(role + ":" + redisKey, (err, cachedStringData) => { //search in cache
                    if (!!cachedStringData) { //if something saved in cache
                        let cachedJSONData = JSON.parse(cachedStringData); //parse to json
                        let dataJSON = cachedJSONData;
                        this.logger.info("[DefaultControllerHelper] handleIndex - " + resourceName + " found in cache for role: " + role);
                        MyExpressRouter.responseWithJSON(res, HttpStatus.OK, dataJSON);

                    } else { //not found in cache, then lets look it up
                        sequelizeModel.findAll({include: includeModels}).then(resources => { //get resources
                            let dataJSON = DefaultControllerHelper.filterResourcesWithPermission(resources, permission); //filter
                            redisClient.setex(role + ":" + redisKey, redisCacheTime, JSON.stringify(dataJSON)); //save in cahce
                            this.logger.info("[DefaultControllerHelper] handleIndex - " + resourceName + " not found in cache for role: " + role);
                            MyExpressRouter.responseWithJSON(res, HttpStatus.OK, dataJSON); //anyway answer normaly

                        }).catch(err => {
                            this.logger.error("[DefaultControllerHelper] handleIndex - " + resourceName + " found in cache for role: " + role + " - " + err.toString());
                            MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

                        });
                    }
                });
            } else {
                let sequelizeQuery = this.getSequelizeQuery(req,permission,includeModels);

                //lets find all resources with query
                sequelizeModel.findAll(sequelizeQuery).then(resources => {
                    console.log(resources);
                    this.logger.info("[DefaultControllerHelper] handleIndex - " + resourceName + " with query: " + JSON.stringify(req.query));
                    //console.log("[DefaultControllerHelper] handleIndex found: "+resources.length);
                    DefaultControllerHelper.respondWithPermissionFilteredResources(req, res, resources, permission);
                }).catch(err => {
                    this.logger.error("[DefaultControllerHelper] handleIndex - " + resourceName + " with query: " + JSON.stringify(req.query) + " - " + err.toString());
                    MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
                });
            }
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to get Resource: ' + resourceName
            });

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
    async handleCreate(req, res, sequelizeResource, myAccessControl, accessControlResource, resourceName, isOwn, updateTableUpdateTimes = false,customAnswer=false) {
        let permission = DefaultControllerHelper.getPermission(req,myAccessControl,accessControlResource,"create",isOwn);

        this.logger.info("[" + this.myExpressRouter.workerID + "][DefaultControllerHelper] handleCreate - " + resourceName + " current_user: " + req.locals.current_user.id + " granted: " + permission.granted);
        if (permission.granted) { //check if allowed to create the resource
            return sequelizeResource.save().then(savedResource => { //save resource, this will generate ids and other stuff
                req.locals[resourceName] = savedResource;
                if(!customAnswer){
                    this.handleGet(req, res, myAccessControl, accessControlResource, resourceName, isOwn);
                }
                this.updateTableUpdateTimes(sequelizeResource.constructor, updateTableUpdateTimes); //pass update check to function
		//console.log("DefaultControllerHelper handleCreate savedResource");
		//console.log(savedResource);
                return savedResource;
            }).catch(err => {
                console.log(err);
                this.logger.error("[" + this.myExpressRouter.workerID + "][DefaultControllerHelper] handleCreate - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                    errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: err.toString()
                });
                return null;
            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to get Resource',
                [resourceName + "_id"]: sequelizeResource.id
            });
            return null;
        }
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
    async handleGet(req, res, myAccessControl, accessControlResource, resourceName, isOwn) {
        let sequelizeResource = req.locals[resourceName]; //get the found resource, found by paramcheckers

        let permission = DefaultControllerHelper.getPermission(req,myAccessControl,accessControlResource,"read",isOwn);
        if (permission.granted) { //can read/get resource
            DefaultControllerHelper.respondWithPermissionFilteredResource(req, res, sequelizeResource, permission);
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to get Resource',
                [resourceName + "_id"]: sequelizeResource.id
            });

        }
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
    async handleUpdate(req, res, myAccessControl, accessControlResource, resourceName, isOwn, updateTableUpdateTimes = false) {
        let sequelizeResource = req.locals[resourceName]; //get the resource
        let permission = DefaultControllerHelper.getPermission(req,myAccessControl,accessControlResource,"update",isOwn);
        this.logger.info("[" + this.myExpressRouter.workerID + "][DefaultControllerHelper] handleUpdate - " + resourceName + " current_user: " + req.locals.current_user.id + " granted: " + permission.granted);
        if (permission.granted) { //can update resource
            this.logger.info("[" + this.myExpressRouter.workerID + "][DefaultControllerHelper] handleUpdate - " + resourceName + " current_user:" + req.locals.current_user.id + " body: " + JSON.stringify(req.body));
            let allowedAttributesToUpdate = permission.filter(req.body); //get Attributes with permission
            this.logger.info("[" + this.myExpressRouter.workerID + "][DefaultControllerHelper] handleUpdate - " + resourceName + " current_user:" + req.locals.current_user.id + " allowedAttributesToUpdate: " + JSON.stringify(allowedAttributesToUpdate));
            sequelizeResource.update(allowedAttributesToUpdate).then((updatedResource) => { //update resource
                req.locals[resourceName] = updatedResource;
                this.handleGet(req, res, myAccessControl, accessControlResource, resourceName, isOwn);
                this.updateTableUpdateTimes(sequelizeResource.constructor, updateTableUpdateTimes);
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][DefaultControllerHelper] handleUpdate - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to update Resource',
                [resourceName + "_id"]: sequelizeResource.id
            });

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
    async handleDelete(req, res, myAccessControl, accessControlResource, resourceName, isOwn, updateTableUpdateTimes = false) {
	    //console.log("Helper handleDelete");
        let sequelizeResource = req.locals[resourceName]; //get the resource which should be deleted
    	//console.log("Found Resource: "+!!sequelizeResource);
        let permission = DefaultControllerHelper.getPermission(req,myAccessControl,accessControlResource,"delete",isOwn);
        this.logger.info("[" + this.myExpressRouter.workerID + "][DefaultControllerHelper] handleDelete - " + resourceName + " current_user: " + req.locals.current_user.id + " granted: " + permission.granted);
        if (permission.granted) { //can delete resource
            let constructor = sequelizeResource.constructor; //get constructor for table update times
            sequelizeResource.destroy().then(amountDeletedResources => { //ignoring the amount of deletions
                DefaultControllerHelper.respondWithDeleteMessage(req, res);
                this.updateTableUpdateTimes(constructor, updateTableUpdateTimes);
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][DefaultControllerHelper] handleDelete - " + resourceName + " " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                    errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: err.toString()
                });

            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to destroy Resource',
                [resourceName + "_id"]: sequelizeResource.id
            });

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
