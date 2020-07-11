import MyExpressRouter from "../module/MyExpressRouter";
import HttpStatus from "http-status-codes";
import DefaultControllerHelper from "../helper/DefaultControllerHelper";
import MyAccessControl from "../module/MyAccessControl";

export default class UserRoleController {

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
        this.routeResources = MyExpressRouter.userrole_routeResources;
        this.routeResource = MyExpressRouter.userrole_routeResource;
        this.accessControlResource = MyExpressRouter.userrole_accessControlResource;
        this.resourceName = MyExpressRouter.userrole_resourceName;
        this.routeResourceForUser = MyExpressRouter.userrole_routeResourceForUser;
    }

    configureRoutes() {
        //Resources
        this.expressApp.get(this.routeResources, this.handleIndex.bind(this)); //Create

        //Resource
        this.expressApp.post(this.routeResource, this.handleCreate.bind(this)); //Create
        this.expressApp.get(this.routeResourceForUser, this.handleGet.bind(this)); //Read
        //this.expressApp.post(this.routeResource,this.handleUpdate.bind(this)); //Update you delete a userrole or create it
        this.expressApp.delete(this.routeResourceForUser, this.handleDelete.bind(this)); //Delete

    }

    /**
     * Routes
     */

    /**
     * @api {get} /api/userroles All User Roles
     * @apiName IndexUserRoles
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup UserRole
     *
     * @apiSuccess {List[[UserRole](#api-5Models-ModelUserRole)]} resources List of UserRole Objects of all UserRole associations.
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR
     * @apiError (Error) {String} error A description of the error
     */
    handleIndex(req, res) {
        let permission = this.myAccessControl.can(req.locals.current_user.role).readAny(this.accessControlResource);
        if (permission.granted) { //can you read all user roles
            this.models.UserRole.findAll().then(resources => { //get all user roles
                DefaultControllerHelper.respondWithPermissionFilteredResources(req, res, resources, permission);
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][UserRoleController] handleIndex - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to get Resource: ' + this.resourceName
            });

        }
    }

    /**
     * @api {post} /api/userroles/user/:id/role/:role_id Create User Role Association
     * @apiName CreateUserRoleAssociation
     * @apiDescription To assign a Role to a User this Endpoint can be used
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup User
     *
     * @apiParam {Number} id User's unique ID
     * @apiParam {Number} role_id The [Role](#api-5Models-ModelRole) Id
     *
     * @apiSuccess {[UserRole](#api-5Models-ModelUserRole)} resource The created User Role.
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is that user or role does not exist.
     * @apiError (Error) {String} error A description of the error
     */
    handleCreate(req, res) {
        let user = req.locals[MyExpressRouter.user_resourceName]; //get user to be changed
        let ownRole = req.locals.current_user.role;
        let role = req.locals[MyExpressRouter.role_resourceName]; //get the role to be set
        let toAssignRoleName = role.name;

        //Check if you want to set a higher role than your own, thats not allowed
        if (!MyAccessControl.inheritatesOrIsSameRole(ownRole, toAssignRoleName, this.myAccessControl)) {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to set higher Role than own! Own: ' + ownRole + " to assign Role: " + toAssignRoleName
            });
            return;
        }

        let isOwn = user.id === req.locals.current_user.id; //check if its own user

        let permission = this.myAccessControl.can(req.locals.current_user.role).createAny(this.accessControlResource);
        if (isOwn) {
            permission = this.myAccessControl.can(req.locals.current_user.role).createOwn(this.accessControlResource);
        }

        this.logger.info("[" + this.myExpressRouter.workerID + "][UserRoleController] handleCreate - current_user: " + req.locals.current_user.id + " user: " + user.id + " role: " + role.name + " permission.granted: " + permission.granted);

        if (permission.granted) { //can edit the role of the given user
            this.models.UserRole.findOne({where: {UserId: user.id}}).then(instance => { //find the user role
                if (!!instance) { //okay we already got a role for that user

                    this.models.Role.findOne({where: {id: instance.RoleId}}).then(toAssignUsersRole => {
                        if (!!toAssignUsersRole) { //if that role still exists, which normaly should
                            let othersRoleName = toAssignUsersRole.name;
                            //lets check if the user we want to assign a role, hash a higher role than usself
                            if (MyAccessControl.isFirstRoleRealyHigher(othersRoleName, ownRole, this.myAccessControl)) {
                                //for example a moderator wanted to make an admin a user, which is forbidden
                                //but a moderator would be allowed to make an other moderator a user

                                MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                                    errorCode: HttpStatus.FORBIDDEN,
                                    error: 'Forbidden to set Role for someone higher than you!'
                                });
                                return;
                            }
                        }
                        //either the role for the other user was not found, or everything is alright
                        instance.RoleId = role.id; //assign role
                        instance.save().then(success => { //save it
                            DefaultControllerHelper.respondWithPermissionFilteredResource(req, res, success, permission);
                        }).catch(err => {
                            this.logger.error("[" + this.myExpressRouter.workerID + "][UserRoleController] handleCreate - " + err.toString());
                            MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

                        });
                    }).catch(err => {
                        this.logger.error("[" + this.myExpressRouter.workerID + "][UserRoleController] handleCreate - " + err.toString());
                        MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

                    });
                } else { //the user we want to assign a role can be promoted
                    this.models.UserRole.create({UserId: user.id, RoleId: role.id}).then(success => { //create userrole
                        DefaultControllerHelper.respondWithPermissionFilteredResource(req, res, success, permission);
                    }).catch(err => {
                        this.logger.error("[" + this.myExpressRouter.workerID + "][UserRoleController] handleCreate - " + err.toString());
                        MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

                    });
                }
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][UserRoleController] handleCreate - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to set Role for user: '
            });

        }
    }

    /**
     * @api {get} /api/userroles/user/:id Get User Role
     * @apiName GetUserRole
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup UserRole
     *
     * @apiParam {Number} id User's unique ID.
     *
     * @apiSuccess {[UserRole](#api-5Models-ModelUserRole)} resource The User Role association.
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is that user does not exist.
     * @apiError (Error) {String} error A description of the error
     */
    handleGet(req, res) {
        let user = req.locals[MyExpressRouter.user_resourceName];
        let isOwn = user.id === req.locals.current_user.id;

        let permission = this.myAccessControl.can(req.locals.current_user.role).readAny(this.accessControlResource);
        if (isOwn) {
            permission = this.myAccessControl.can(req.locals.current_user.role).readOwn(this.accessControlResource);
        }
        if (permission.granted) { //can we read a user role
            this.models.UserRole.findOne({where: {UserId: user.id}}).then(sequelizeResource => { //find user role
                DefaultControllerHelper.respondWithPermissionFilteredResource(req, res, sequelizeResource, permission);
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][UserRoleController] handleGet - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to get Resource: ' + this.resourceName
            });

        }
    }

    /**
     * @api {delete} /api/userroles/user/:user_id/ Delete User Role
     * @apiName DeleteUserRole
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup UserRole
     *
     * @apiParam {Number} user_id User's unique ID.
     * @apiParam {Number} role_id User's unique Role ID.
     *
     * @apiUse DefaultControllerDelete
     * @apiDescription Users can only delete their own resources.
     */
    handleDelete(req, res) {
        let user = req.locals[MyExpressRouter.user_resourceName]; //get user to be changed
        let ownRole = req.locals.current_user.role;
        let isOwn = user.id === req.locals.current_user.id;

        let permission = this.myAccessControl.can(req.locals.current_user.role).deleteAny(this.accessControlResource);
        if (isOwn) {
            permission = this.myAccessControl.can(req.locals.current_user.role).deleteOwn(this.accessControlResource);
        }
        if (permission.granted) { //can we could delete a user role
            this.models.UserRole.findOne({where: {UserId: user.id}}).then(sequelizeResource => {
                if(!!sequelizeResource){ //if that user role exists
                    this.models.Role.findOne({where: {id: sequelizeResource.RoleId}}).then(toAssignUsersRole => {
                        let othersRoleName = toAssignUsersRole.name;
                        //lets check if the user we want to assign a role, hash a higher role than usself
                        if (MyAccessControl.isFirstRoleRealyHigher(othersRoleName, ownRole, this.myAccessControl)) {
                            //for example a moderator wanted to delete an admins role enty, which is forbidden
                            //but a moderator would be allowed to delete an other moderator role entry
                            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                                errorCode: HttpStatus.FORBIDDEN,
                                error: 'Forbidden to delete Role for someone higher than you!'
                            });
                            return;
                        }

                        //otherwise the deletion of the user role is ok
                        req.locals[this.resourceName] = sequelizeResource;
                        this.myExpressRouter.defaultControllerHelper.handleDelete(req, res, this.myAccessControl, this.accessControlResource, this.resourceName, isOwn);
                    }).catch(err => {
                        this.logger.error("[" + this.myExpressRouter.workerID + "][UserRoleController] handleDelete - " + err.toString());
                        MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
                    });
                } else { //well nothing to delete
                    DefaultControllerHelper.respondWithDeleteMessage(req,res); //handle as success anyway
                }
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][UserRoleController] handleDelete - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

            });

        }
    }
}
