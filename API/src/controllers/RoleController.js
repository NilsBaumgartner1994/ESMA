import MyExpressRouter from "../module/MyExpressRouter";

export default class RoleController {

    constructor(logger, models, expressApp, myAccessControl, myExpressRouter) {
        this.logger = logger;
        this.models = models;
        this.expressApp = expressApp;
        this.myAccessControl = myAccessControl;
        this.myExpressRouter = myExpressRouter;
        this.prepareRoutes();
        this.configureRoutes();
    }

    prepareRoutes() {
        this.resource_id_parameter = MyExpressRouter.role_resource_id_parameter;
        this.routeResources = MyExpressRouter.role_routeResources;
        this.routeResource = MyExpressRouter.role_routeResource;
        this.role_routeResourceInheritedRoles = MyExpressRouter.role_routeResourceInheritedRoles;
        this.accessControlResource = MyExpressRouter.role_accessControlResource;
        this.resourceName = MyExpressRouter.role_resourceName;
    }

    configureRoutes() {
        //Param Checker
        this.expressApp.param(this.resource_id_parameter, this.paramcheckerResourceId.bind(this));

        //Resources
        this.expressApp.get(this.routeResources, this.handleIndex.bind(this)); //Create

        //Resource
        //this.expressApp.post(routeResources,this.handleCreate.bind(this)); //Create
        this.expressApp.get(this.routeResource, this.handleGet.bind(this)); //Read
        this.expressApp.post(this.routeResource, this.handleUpdate.bind(this)); //Update
        this.expressApp.delete(this.routeResource, this.handleDelete.bind(this)); //Delete
    }

    paramcheckerResourceId(req, res, next, resource_id) {
        this.myExpressRouter.defaultControllerHelper.paramcheckerResourceId(req, res, next, resource_id, this.models.Role, this.accessControlResource, this.resourceName);
    };

    /**
     * Routes
     */

    /**
     * @api {get} /api/roles All Roles
     * @apiName IndexRoles
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Role
     *
     * @apiSuccess {List[[Role](#api-5Models-ModelRole)]} resources List of Role Objects of all Roles.
     * @apiUse DefaultControllerIndex
     */
    handleIndex(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleIndex(req, res, this.models.Role, this.myAccessControl, this.accessControlResource, this.resourceName);
    }

    /**
     * @api {get} /api/roles/:id Get Role
     * @apiName GetRole
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Role
     *
     * @apiParam {Number} id Role's unique ID.
     *
     * @apiSuccess {[Role](#api-5Models-ModelRole)} resource The Role.
     * @apiUse DefaultControllerGet
     */
    handleGet(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleGet(req, res, this.myAccessControl, this.accessControlResource, this.resourceName, false);
    }

    /**
     * @api {post} /api/roles/:id Update Role
     * @apiName UpdateRole
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Role
     *
     * @apiParam {Number} id Role's unique ID.
     *
     * @apiParam (Request message body) {[Role](#api-5Models-ModelRole)} prop Depending on [Permission](#api-Permission)
     *
     * @apiSuccess {[Role](#api-5Models-ModelRole)} resource The updated role.
     * @apiUse DefaultControllerUpdate
     */
    handleUpdate(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleUpdate(req, res, this.myAccessControl, this.accessControlResource, this.resourceName, false);
    }

    /**
     * @api {delete} /api/roles/:id Delete Role
     * @apiName DeleteRole
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Role
     *
     * @apiParam {Number} id Role's unique ID.
     *
     * @apiUse DefaultControllerDelete
     */
    handleDelete(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleDelete(req, res, this.myAccessControl, this.accessControlResource, this.resourceName, false);
    }
}
