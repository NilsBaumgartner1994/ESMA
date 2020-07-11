import MyExpressRouter from "../module/MyExpressRouter";
import HttpStatus from "http-status-codes";
import DefaultControllerHelper from "../helper/DefaultControllerHelper";

export default class StreamViewController {

    constructor(logger, models, expressApp, myAccessControl, myExpressRouter) {
        this.logger = logger;
        this.models = models;
        this.expressApp = expressApp;
        this.myAccessControl = myAccessControl;
        this.myExpressRouter = myExpressRouter;
        this.prepareRoutes();
        this.configureRoutes();
        this.logger.info("[" + this.myExpressRouter.workerID + "][StreamViewController] initialised");
    }

    prepareRoutes() {
        this.resource_id_parameter = MyExpressRouter.streamview_resource_id_parameter;
        this.routeResources = MyExpressRouter.streamview_routeResources;
        this.routeResource = MyExpressRouter.streamview_routeResource;
        this.accessControlResource = MyExpressRouter.streamview_accessControlResource;
        this.resourceName = MyExpressRouter.streamview_resourceName;
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
    }

    paramcheckerResourceId(req, res, next, streamview_id) {
        req.locals.isOwnStreamView = false; //default its not your streamview

        this.models.StreamView.findOne({where: {id: streamview_id}}).then(streamview => {
            // search for streamview
            if (!streamview) { //no streamview found
                MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {
                    error: 'streamview_id not found',
                    streamview_id: streamview_id
                });
            } else { //ok streamview exists
                req.locals[this.resourceName] = streamview; //save it for other functions
                streamview.getDevice().then(device => { //get the corresponding device
                    if (!device) { //device does not exist ?
                        next(); //anyways continue
                        return;
                    }

                    device.getUser().then(user => { //well lets find the user for that streamview
                        if (!!user) { //well the user exists
                            req.locals.isOwnStreamView = req.locals.current_user.id === user.id; // check if it's own device
                        }
                        next(); //continue
                        return;
                    }).catch(err => {
                        this.logger.error("[" + this.myExpressRouter.workerID + "][StreamViewController] paramcheckerResourceId - " + err.toString());
                        MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

                    });
                }).catch(err => {
                    this.logger.error("[" + this.myExpressRouter.workerID + "][StreamViewController] paramcheckerResourceId - " + err.toString());
                    MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

                });
            }
        }).catch(err => {
            this.logger.error("[" + this.myExpressRouter.workerID + "][StreamViewController] paramcheckerResourceId - " + err.toString());
            MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

        });
    };

    /**
     * Routes
     */

    /**
     * @api {get} /api/streamviews All Stream Views
     * @apiName IndexStreamViews
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup StreamView
     *
     * @apiSuccess {List[[StreamView](#api-5Models-ModelStreamView)]} resources List of StreamView Objects of all StreamViews.
     * @apiUse DefaultControllerIndex
     */
    handleIndex(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleIndex(req, res, this.models.StreamView, this.myAccessControl, this.accessControlResource, this.resourceName, [], null);
    }

    /**
     * @api {post} /api/streamviews Create Stream View
     * @apiName CreateStreamView
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup StreamView
     *
     * @apiParam (Request message body) {Number} device_id The [Device](#api-5Models-ModelDevice)'s Id from where the StreamView comes
     * @apiParam (Request message body) {String} screen The corresponding screen
     * @apiParam (Request message body) {String} [event] The corresponding screen
     * @apiParam (Request message body) {String} eventTime The corresponding screen
     *
     * @apiSuccess {[StreamView](#api-5Models-ModelStreamViw)} resource The Stream View.
     */
    handleCreate(req, res) {
        let device_id = req.body.device_id;

        if (!device_id) { //no device_id given ?
            MyExpressRouter.responseWithJSON(res, HttpStatus.BAD_REQUEST, {error: "device_id is missing"});
            return;
        }

        this.models.Device.findOne({where: {id: device_id}}).then(device => { //search for device
            if (!device) { //device does not exist
                MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {
                    error: 'device_id not found',
                    device_id: device_id
                });
                return;
            }

            device.getUser().then(user => { //search for user
                if(!user){
                    MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {
                        error: 'no user for device found',
                        device_id: device_id
                    });
                    return;
                }
                let isOwn = req.locals.current_user.id = user.id; //check if user_ids match
		        req.locals.isOwnStreamView = isOwn;
                let permission = this.myAccessControl.can(req.locals.current_user.role).createAny(this.accessControlResource);
                if (isOwn) {
                    permission = this.myAccessControl.can(req.locals.current_user.role).createOwn(this.accessControlResource);
                }
                if (permission.granted) { //can you create a streamview ?
                    let fileteredDataJSON = permission.filter(req.body); //remove Attributes without Permission
                    //TODO: check if date is valid (near time now ?)
                    let sequelizeResource = this.models.StreamView.build(fileteredDataJSON);
                    sequelizeResource.setDevice(device, {save: false});
                    sequelizeResource.save().then(savedResource => { //save streamview
                        DefaultControllerHelper.respondWithPermissionFilteredResource(req,res,savedResource,permission);
                        return;
                    }).catch(err => {
                        this.logger.error("[" + this.myExpressRouter.workerID + "][StreamViewController] handleCreate - " + err.toString());
                        MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
                    });
                } else {
                    MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                        errorCode: HttpStatus.FORBIDDEN,
                        error: 'Forbidden to create resource ' + this.resourceName
                    });

                }
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][StreamViewController] handleCreate - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

            });
        }).catch(err => {
            this.logger.error("[" + this.myExpressRouter.workerID + "][StreamViewController] handleCreate - " + err.toString());
            MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

        });
    }

    /**
     * @api {get} /api/streamviews/:id Get Stream View
     * @apiName GetStreamView
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup StreamView
     *
     * @apiParam {Number} id Stream View's unique ID.
     *
     * @apiSuccess {[StreamView](#api-5Models-ModelStreamView)} resource The StreamView.
     * @apiUse DefaultControllerGet
     * @apiDescription Users can only get their own resources.
     */
    handleGet(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleGet(req, res, this.myAccessControl, this.accessControlResource, this.resourceName, req.locals.isOwnStreamView);
    }

    /**
     * @api {post} /api/streamviews/:id Update StreamView
     * @apiName UpdateStreamView
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup StreamView
     *
     * @apiParam {Number} id StreamView's unique ID.
     *
     * @apiParam (Request message body) {[StreamView](#api-5Models-ModelStreamView)} prop Depending on [Permission](#api-Permission)
     *
     * @apiSuccess {[StreamView](#api-5Models-ModelStreamView)} resource The updated streamview.
     * @apiUse DefaultControllerUpdate
     */
    handleUpdate(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleUpdate(req, res, this.myAccessControl, this.accessControlResource, this.resourceName, req.locals.isOwnStreamView);
    }

    /**
     * @api {delete} /api/streamviews/:id Delete Stream View
     * @apiName DeleteStreamView
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup StreamView
     *
     * @apiParam {Number} id Stream View's unique ID.
     *
     * @apiUse DefaultControllerDelete
     * @apiDescription Users can only delete their own resources.
     */
    handleDelete(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleDelete(req, res, this.myAccessControl, this.accessControlResource, this.resourceName, req.locals.isOwnStreamView);
    }
}
