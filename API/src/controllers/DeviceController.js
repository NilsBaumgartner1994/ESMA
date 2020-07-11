import MyExpressRouter from "../module/MyExpressRouter";
import HttpStatus from "http-status-codes";
import DefaultControllerHelper from "../helper/DefaultControllerHelper";

export default class DeviceController {

    constructor(logger, models, expressApp, myAccessControl, myExpressRouter) {
        this.logger = logger;
        this.models = models;
        this.expressApp = expressApp;
        this.myAccessControl = myAccessControl;
        this.myExpressRouter = myExpressRouter;
        this.prepareRoutes();
        this.configureRoutes();
        this.logger.info("[" + this.myExpressRouter.workerID + "][DeviceController] initialised");
    }

    prepareRoutes() {
        this.resource_id_parameter = MyExpressRouter.device_resource_id_parameter;
        this.routeResources = MyExpressRouter.device_routeResources;
        this.routeResource = MyExpressRouter.device_routeResource;
        this.accessControlResource = MyExpressRouter.device_accessControlResource;
        this.resourceName = MyExpressRouter.device_resourceName;

        this.device_routeStreamViews = MyExpressRouter.device_routeStreamViews;
    }

    configureRoutes() {
        //Param Checker
        this.expressApp.param(this.resource_id_parameter, this.paramcheckerResourceId.bind(this));

        //Resources
        this.expressApp.get(this.routeResources, this.handleIndex.bind(this)); // Index

        //Resource
        this.expressApp.post(this.routeResources, this.handleCreate.bind(this)); //Create
        this.expressApp.get(this.routeResource, this.handleGet.bind(this)); //Read
        this.expressApp.post(this.routeResource, this.handleUpdate.bind(this)); //Update
        this.expressApp.delete(this.routeResource, this.handleDelete.bind(this)); //Delete

        // StreamViews
        this.expressApp.get(this.device_routeStreamViews, this.handleGetStreamViews.bind(this));
    }

    paramcheckerResourceId(req, res, next, device_id) {
        this.models.Device.findOne({where: {id: device_id}}).then(device => {
            // user will be the first entry of the Users table with matching parameter || null
            if (device === null) {
                this.logger.info("[" + this.myExpressRouter.workerID + "][DeviceController] paramcheckerResourceId - device_id " + device_id);
                MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {
                    error: 'device_id not found',
                    device_id: device_id
                });

            } else {
                req.locals[this.resourceName] = device; //save the found device
                device.getUser().then(user => {
                    //first check if its our own device
                    req.locals.isOwnDevice = false; // default its not our device
                    if (user !== null) { //if we got a user
                        let current_user_id = req.locals.current_user.id;
                        let device_user_id = user.id;
                        //check if user is and device id matches
                        if (!!current_user_id && !!device_user_id && current_user_id === device_user_id) {
                            req.locals.isOwnDevice = true;
                        }
                    }
                    next(); // but anyways continue, maybe we are an admin or something

                }).catch(err => {
                    this.logger.error("[" + this.myExpressRouter.workerID + "][DeviceController] paramcheckerResourceId - " + err.toString());
                    MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

                });
            }
        }).catch(err => {
            this.logger.error("[" + this.myExpressRouter.workerID + "][DeviceController] paramcheckerResourceId - " + err.toString());
            MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

        });
    };

    /**
     * Routes
     */

    /**
     * @api {get} /api/devices All Devices
     * @apiName IndexDevices
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Device
     *
     * @apiSuccess {List[[Device](#api-5Models-ModelDevice)]} resources List of Device Objects of all Devices.
     * @apiUse DefaultControllerIndex
     */
    handleIndex(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleIndex(req, res, this.models.Device, this.myAccessControl, this.accessControlResource, this.resourceName);
    }

    /**
     * @api {post} /api/devices Create Device
     * @apiName CreateDevice
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup Device
     *
     * @apiParam (Request message body) {Number} user_id The [User](#api-5Models-ModelUser)'s Id
     *
     * @apiSuccess {[Building](#api-5Models-ModelBuilding)} resource The created building.
     * @apiUse DefaultControllerCreate
     */
    handleCreate(req, res) {
	const instance = this;
        let user_id = req.body.user_id;
        if (user_id === undefined) { //check is there a user id ?
            this.logger.info("[" + this.myExpressRouter.workerID + "][DeviceController] handleCreate - user_id is missing");
            MyExpressRouter.responseWithJSON(res, HttpStatus.BAD_REQUEST, {error: "user_id is missing"});
            return; //no ? then go f yourself, send correct requests
        }
        //okay we got a user id given
        this.models.User.findOne({where: {id: user_id}}).then(user => {
            if (user === null) { //user does not exists
                this.logger.info("[" + this.myExpressRouter.workerID + "][DeviceController] handleCreate - user_id " + user_id + " not found");
                MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {
                    error: 'user_id not found',
                    user_id: user_id
                });
                return; //well sorry bro, we couldnt find him
            }

            let isOwn = req.locals.current_user.id + "" === user_id + ""; //okay lets check if thats you ?
	    req.locals.isOwnDevice = isOwn;
            let sequelizeResource = this.models.Device.build({}); //prepare device
            let permission = this.myAccessControl.can(req.locals.current_user.role).createAny(this.accessControlResource);
            if (isOwn) { //if thats you, you can try this permission
                permission = this.myAccessControl.can(req.locals.current_user.role).createOwn(this.accessControlResource);
            }
            if (permission.granted) { //if you are a lucky boy and are allowed to create a device
                sequelizeResource.setUser(user, {save: false}); //add the user but ! dont save, its not finished get

                sequelizeResource.save().then(savedResource => { //okay save it now
                    req.locals[instance.resourceName] = savedResource;
                    instance.handleGet(req,res);
		    return;
                }).catch(err => {
                    this.logger.error("[" + this.myExpressRouter.workerID + "][DeviceController] handleCreate - " + err.toString());
                    MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

                });
            } else {
                MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                    errorCode: HttpStatus.FORBIDDEN,
                    error: 'Forbidden to get Resource',
                    [this.resourceName + "_id"]: sequelizeResource.id
                });

            }
        }).catch(err => {
            this.logger.error("[" + this.myExpressRouter.workerID + "][DeviceController] handleCreate - " + err.toString());
            MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

        });
    }

    /**
     * @api {get} /api/devices/:id Get Device
     * @apiName GetDevice
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup Device
     *
     * @apiParam {Number} id Device's unique ID.
     *
     * @apiSuccess {[Device](#api-5Models-ModelDevice)} resource The device.
     * @apiUse DefaultControllerGet
     * @apiDescription Users can only get their own resources.
     */
    handleGet(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleGet(req, res, this.myAccessControl, this.accessControlResource, this.resourceName, req.locals.isOwnDevice);
    }

    /**
     * @api {post} /api/devices/:id Update Device
     * @apiName UpdateDevice
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup Device
     *
     * @apiParam {Number} id Device's unique ID.
     *
     * @apiParam (Request message body) {[Device](#api-5Models-ModelDevice)} prop Depending on [Permission](#api-Permission)
     *
     * @apiSuccess {[Device](#api-5Models-ModelCanteen)} resource The updated device.
     * @apiUse DefaultControllerUpdate
     */
    handleUpdate(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleUpdate(req, res, this.myAccessControl, this.accessControlResource, this.resourceName, req.locals.isOwnDevice);
    }

    /**
     * @api {delete} /api/devices/:id Delete Device
     * @apiName DeleteDevice
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup Device
     *
     * @apiParam {Number} id Device's unique ID.
     *
     * @apiUse DefaultControllerDelete
     * @apiDescription Users can only delete their own resources.
     */
    handleDelete(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleDelete(req, res, this.myAccessControl, this.accessControlResource, this.resourceName, req.locals.isOwnDevice);
    }

    /**
     * @api {get} /api/devices/:id/streamviews Get StreamView of Device
     * @apiName GetStreamViewOfDevice
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup Device
     *
     * @apiParam {Number} id Device's unique ID.
     *
     * @apiSuccess {List[[StreamView](#api-5Models-ModelStreamView)]} resources The streamviews of a device as list.
     */
    handleGetStreamViews(req, res) {
        let isOwn = req.locals.isOwnDevice; //okay is it your device ?
        let permission = this.myAccessControl.can(req.locals.current_user.role).readAny(MyExpressRouter.streamview_accessControlResource);
        if (isOwn) {
            permission = this.myAccessControl.can(req.locals.current_user.role).readOwn(MyExpressRouter.streamview_accessControlResource);
        }
        if (permission.granted) { //if you can get this resource
            let device = req.locals[this.resourceName]; //lets get the device
            device.getStreamViews().then(resources => { // get all stream views
                DefaultControllerHelper.respondWithPermissionFilteredResources(req,res,resources,permission);
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][DeviceController] handleGetStreamViews - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to get Devices: ' + MyExpressRouter.streamview_accessControlResource
            });

        }
    }
}
