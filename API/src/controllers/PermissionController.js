import MyExpressRouter from "../module/MyExpressRouter";
import HttpStatus from "http-status-codes";

/**
 * @apiDefine Permission Permission
 * For almost all Endpoints in this API permissions are needed. Detailed information can be obtained in the File: "src/module/MyAccessControl.js".You can view [All Permissions](#api-Permission-IndexPermissions) or depending on your role at [Get Permissions](#api-Permission-GetPermissions).
 * Permissions will be used to filter attributes of requests. Some requests will fail with insufficient Permissions and the response will contain a HTTP-Code "FORBIDDEN" then.
 */
export default class PermissionController {

    constructor(logger, models, expressApp, myAccessControl, myExpressRouter) {
        this.logger = logger;
        this.models = models;
        this.expressApp = expressApp;
        this.myAccessControl = myAccessControl;
        this.myExpressRouter = myExpressRouter;
        this.prepareRoutes();
        this.configureRoutes();
        this.logger.info("[" + this.myExpressRouter.workerID + "][PermissionController] initialised");
    }

    prepareRoutes() {
        this.routeResources = MyExpressRouter.permission_routeResources;
        this.routeResourceOwn = MyExpressRouter.permission_routeOwn;
        this.accessControlResource = MyExpressRouter.permissions_accessControlResource;
        this.resourceName = MyExpressRouter.permissions_resourceName;
    }

    configureRoutes() {
        //Resources
        this.expressApp.get(this.routeResources, this.handleIndex.bind(this)); // Index
        this.expressApp.get(this.routeResourceOwn, this.handleGet.bind(this)); // Get
    }

    /**
     * Adds a Permission to a given Permission JSON Object if permission is granted
     * @param permissionJSON The Permission JSON Object
     * @param role The role of the user
     * @param resource The resource for the permission
     * @param action The action for the permission
     * @param permission The permission object
     * @returns {*} permissionJSON
     */
    addAttributesIfGranted(permissionJSON, role, resource, action, permission) {
        if (permission.granted) {
            let attributes = permission.attributes;
            let rolePermission = permissionJSON[role] || {};
            let resourcePermission = rolePermission[resource] || {};
            resourcePermission[action] = attributes;
            rolePermission[resource] = resourcePermission;
            permissionJSON[role] = rolePermission;
        }
        return permissionJSON;
    }

    /**
     * Find all Permissions for all Resources for a given role
     * @param role The role we want to get all Permissions
     * @returns {*} permissionJSON for a Role
     */
    getAllPermissionsForRole(role) {
        let permissionJSON = {}; //create empty permission JSON
        let resources = this.myAccessControl.getResources(); //lets get all Resources
        for (let i = 0; i < resources.length; i++) { //for all resources
            let resource = resources[i]; //get the resource

            //Create
            let permissionCreateAny = this.myAccessControl.can(role).createAny(resource); //permission for resource to create any
            permissionJSON = this.addAttributesIfGranted(permissionJSON, role, resource, "create:any", permissionCreateAny);
            let permissionCreateOwn = this.myAccessControl.can(role).createOwn(resource); //permission for resource to create own
            permissionJSON = this.addAttributesIfGranted(permissionJSON, role, resource, "create:own", permissionCreateOwn);

            //Read
            let permissionReadAny = this.myAccessControl.can(role).readAny(resource); //permission for resource to read any
            permissionJSON = this.addAttributesIfGranted(permissionJSON, role, resource, "read:any", permissionReadAny);
            let permissionReadOwn = this.myAccessControl.can(role).readOwn(resource); //permission for resource to read own
            permissionJSON = this.addAttributesIfGranted(permissionJSON, role, resource, "read:own", permissionReadOwn);

            //Update
            let permissionUpdateAny = this.myAccessControl.can(role).updateAny(resource); //permission for resource to update any
            permissionJSON = this.addAttributesIfGranted(permissionJSON, role, resource, "update:any", permissionUpdateAny);
            let permissionUpdateOwn = this.myAccessControl.can(role).updateOwn(resource); //permission for resource to update own
            permissionJSON = this.addAttributesIfGranted(permissionJSON, role, resource, "update:own", permissionUpdateOwn);

            //Delete
            let permissionDeleteAny = this.myAccessControl.can(role).deleteAny(resource); //permission for resource to delete any
            permissionJSON = this.addAttributesIfGranted(permissionJSON, role, resource, "delete:any", permissionDeleteAny);
            let permissionDeleteOwn = this.myAccessControl.can(role).deleteOwn(resource); //permission for resource to delete own
            permissionJSON = this.addAttributesIfGranted(permissionJSON, role, resource, "delete:own", permissionDeleteOwn);
        }
        return permissionJSON; //finished for all permissions
    }

    /**
     * Get All Permissions for all roles that exist
     * @returns {*} permissionJSON for all roles
     */
    getAllPermissionsForAllRoles() {
        let roles = this.myAccessControl.getRoles(); //get all roles
        let allPermissionJSON = {}; //create empty permission object
        for (let i = 0; i < roles.length; i++) { //for all roles
            let role = roles[i]; //get role
            let rolePermissions = this.getAllPermissionsForRole(role); //get all permissions for role
            allPermissionJSON = Object.assign(allPermissionJSON, rolePermissions); //merge the permissions for a specific role with the rest
        }
        return allPermissionJSON;
    }

    /**
     * @api {get} /api/permissions All Permissions
     * @apiName IndexPermissions
     * @apiPermission Admin
     * @apiGroup Permission
     *
     * @apiSuccess {JSON[Role[Model[Action]]]} permission JSON Object of all permissions.
     */
    handleIndex(req, res) {
        let role = req.locals.current_user.role;
        let permission = this.myAccessControl.can(role).readAny(this.accessControlResource); //can you read all permissions
        if (permission.granted) {
            try {
                let permissionJSON = this.getAllPermissionsForAllRoles(); //get all permissions for all roles
                MyExpressRouter.responseWithJSON(res, HttpStatus.OK, permissionJSON);

            } catch (err) {
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                    errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: err.toString()
                });

            }
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to read all Permissions'
            });

        }

        /**
         * Dont do this
         * This will show all permissions from all roles, which we dont want, only those you can see/change
         let grantList = this.myAccessControl.getGrants();
         MyExpressRouter.responseWithJSON(res, HttpStatus.OK, grantList);
         */
    }

    /**
     * @api {get} /api/permissions/own Get Permissions
     * @apiName GetPermissions
     * @apiPermission Anonym
     * @apiGroup Permission
     *
     * @apiSuccess {JSON[Role[Model[Action]]]} permission JSON Object of own permissions depending on own role.
     */
    handleGet(req, res) {
        let role = req.locals.current_user.role;
        let permission = this.myAccessControl.can(role).readOwn(this.accessControlResource); //can you read your own permissions
        if (permission.granted) {
            try {
                let permissionJSON = this.getAllPermissionsForRole(role); //get permissions for your role
                MyExpressRouter.responseWithJSON(res, HttpStatus.OK, permissionJSON);
            } catch (err) {
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                    errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: err.toString()
                });

            }
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to read own Permissions'
            });

        }
    }

    //TODO: Add functionality to get all inherited roles of own
    //TODO: Add functionality to get all permissions of specific role
}
