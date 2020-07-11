import HttpStatus from "http-status-codes";
import MyExpressRouter from "../module/MyExpressRouter";
import CryptoHelper from "../helper/CryptoHelper";
import MyAccessControl from "../module/MyAccessControl";
import DefaultControllerHelper from "../helper/DefaultControllerHelper";

export default class UserController {

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
        this.resource_id_parameter = MyExpressRouter.user_resource_id_parameter;
        this.routeResources = MyExpressRouter.user_routeResources;
        this.routeResource = MyExpressRouter.user_routeResource;
        this.accessControlResource = MyExpressRouter.user_accessControlResource;
        this.resourceName = MyExpressRouter.user_resourceName;

        //Special
        this.routeUsersAmount = MyExpressRouter.user_routeAmount;
        this.routeUsersDevice = MyExpressRouter.user_routeUsersDevice;
        this.routeUserGetNewToken = MyExpressRouter.user_routeUserGetNewToken;
        this.user_routeUserPrivacyPolicyRead = MyExpressRouter.user_routeUserPrivacyPolicyRead;

        //Favorite Meals
        this.user_routeUsersFavoriteMeals = MyExpressRouter.user_routeUsersFavoriteMeals;
        this.user_routeUsersFavoriteMeal = MyExpressRouter.user_routeUsersFavoriteMeal;

        //Friends
        this.user_routeUsersFriends = MyExpressRouter.user_routeUsersFriends;
        this.user_routeUsersFriend = MyExpressRouter.user_routeUsersFriend;
        this.friend_resourceName = MyExpressRouter.friend_resourceName;
        this.friend_resource_id_parameter = MyExpressRouter.friend_resource_id_parameter;

        //FriendRequest
        this.user_routeUsersFriendRequests = MyExpressRouter.user_routeUsersFriendRequests;
        this.user_routeUsersFriendRequest = MyExpressRouter.user_routeUsersFriendRequest;
        this.friendrequest_resourceName = MyExpressRouter.friendrequest_resourceName;
        this.friendrequest_resource_id_parameter = MyExpressRouter.friendrequest_resource_id_parameter;

        //UserMarkings
        this.userMarking_accessControlResource = MyExpressRouter.userMarking_accessControlResource;
        this.user_routeMarkings = MyExpressRouter.user_routeMarkings;
        this.user_routeMarking = MyExpressRouter.user_routeMarking;

        //UserSelectedCanteen
        this.user_selectedCanteen_routeIdentifier = MyExpressRouter.user_selectedCanteen_routeIdentifier;


        //WasherNotifications
        this.user_routeWasherNotifications = MyExpressRouter.user_routeWasherNotifications;
        this.user_routeWasherNotification = MyExpressRouter.user_routeWasherNotification;
    }

    configureRoutes() {
        //Param Checker
        this.expressApp.param(this.resource_id_parameter, this.paramcheckerUserID.bind(this)); //automaticly checks if a user exists
        this.expressApp.param(this.friend_resource_id_parameter, this.paramcheckerFriendID.bind(this)); //automaticly checks if a friend exists
        this.expressApp.param(this.friendrequest_resource_id_parameter, this.paramcheckerFriendRequestID.bind(this)); //automaticly checks if a friendrequest exists

        this.expressApp.get(this.routeUsersAmount, this.handleGetAmount.bind(this));

        //Resources
        this.expressApp.get(this.routeResources, this.handleIndex.bind(this));

        //Resource
        this.expressApp.post(this.routeResources, this.handleCreate.bind(this));
        this.expressApp.get(this.routeResource, this.handleGet.bind(this));
        this.expressApp.post(this.routeResource, this.handleUpdate.bind(this));
        this.expressApp.delete(this.routeResource, this.handleDelete.bind(this));

        //Device
        this.expressApp.get(this.routeUsersDevice, this.handleGetDevice.bind(this));
        this.expressApp.post(this.routeUserGetNewToken, this.myExpressRouter.middlewareOnlyAuthenticatedViaPlaintextSecret.bind(this), this.handleGetNewToken.bind(this));
        this.expressApp.post(this.user_routeUserPrivacyPolicyRead, this.handleUpdatePrivacyPolicy.bind(this));

        // Favorite Meals
        this.expressApp.get(this.user_routeUsersFavoriteMeals, this.handleGetFavoriteMeals.bind(this));
        this.expressApp.post(this.user_routeUsersFavoriteMeal, this.handleCreateFavoriteMeal.bind(this));
        this.expressApp.get(this.user_routeUsersFavoriteMeal, this.handleGetFavoriteMeal.bind(this));
        this.expressApp.delete(this.user_routeUsersFavoriteMeal, this.handleDeleteFavoriteMeal.bind(this));

        // Friends
        this.expressApp.get(this.user_routeUsersFriends, this.handleGetFriends.bind(this));
        this.expressApp.post(this.user_routeUsersFriend, this.handleCreateFriend.bind(this));
        this.expressApp.get(this.user_routeUsersFriend, this.handleGetFriend.bind(this));
        this.expressApp.delete(this.user_routeUsersFriend, this.handleDeleteFriend.bind(this));

        // FriendRequests
        this.expressApp.get(this.user_routeUsersFriendRequests, this.handleGetFriendRequests.bind(this));
        this.expressApp.post(this.user_routeUsersFriendRequest, this.handleCreateFriendRequest.bind(this));
        this.expressApp.get(this.user_routeUsersFriendRequest, this.handleGetFriendRequest.bind(this));
        this.expressApp.delete(this.user_routeUsersFriendRequest, this.handleDeleteFriendRequest.bind(this));

        // UserMarkings
        this.expressApp.get(this.user_routeMarkings, this.handleGetUserMarkings.bind(this));
        this.expressApp.post(this.user_routeMarking, this.handleCreateUserMarking.bind(this));
        this.expressApp.get(this.user_routeMarking, this.handleGetUserMarking.bind(this));
        this.expressApp.delete(this.user_routeMarking, this.handleDeleteUserMarking.bind(this));

        // User Washer Notificatios
        this.expressApp.get(this.user_routeWasherNotifications, this.handleGetUserWasherNotifications.bind(this));
        this.expressApp.post(this.user_routeWasherNotification, this.handleCreateUserWasherNotification.bind(this));
        this.expressApp.get(this.user_routeWasherNotification, this.handleGetUserWasherNotification.bind(this));
        this.expressApp.delete(this.user_routeWasherNotification, this.handleDeleteUserWasherNotification.bind(this));
    }

    /**
     * Checks if the id in the url is corresponding to a real user id. Also saves the user instance in a variable
     * @param req THe request object
     * @param res The response object
     * @param next The next function
     * @param user_id The id which should be checked
     */
    paramcheckerUserID(req, res, next, user_id) {
        this.models.User.findOne({where: {id: user_id}}).then(user => { //seach for user id
            // user will be the first entry of the Users table with matching parameter || null
            if (!user) { //if no user found
                MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {
                    error: 'user_id not found',
                    user_id: user_id
                });
                return;
            } else { //user was found
                req.locals[this.resourceName] = user; //save the found user
                req.locals.isOwnUser = req.locals.current_user.id === user.id; // check if it's own user
                next(); //confinue
                return;
            }
        }).catch(err => { //unexpected error
            this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] paramcheckerUserID - " + err.toString());
            MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

        });
    };

    /**
     * Param Checker for friend id. A Friend is also a user. Saves the friend Instance
     * @param req THe request object
     * @param res The response object
     * @param next THe next function
     * @param friend_id The friend id
     */
    paramcheckerFriendID(req, res, next, friend_id) {
        this.models.User.findOne({where: {id: friend_id}}).then(friend => { //search the friend
            // user will be the first entry of the Users table with matching parameter || null
            if (!friend) { // no friend found
                MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {
                    error: 'friend_id not found',
                    friend_id: friend_id
                });
                return;
            } else { //friend user found
                req.locals[this.friend_resourceName] = friend; //save the found user
                let user = req.locals[this.resourceName]; //get user
                user.getFriends().then(friends => { //friends are a list
                    req.locals.isOwnFriend = false; // default its not your friend
                    for (let i = 0; i < friends.length; i++) {
                        let toCheck = friends[i];
                        if (toCheck.id === friend.id) {
                            req.locals.isOwnFriend = true; // okay check hes in users friendlist
                        }
                    }
                    next(); //continue
                    return;
                }).catch(err => {
                    this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] paramcheckerFriendID - " + err.toString());
                    MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

                });
            }
        }).catch(err => {
            this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] paramcheckerFriendID - " + err.toString());
            MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

        });
    };

    /**
     * Param Checker for friend request id. A User which should become a friend. Saves the user Instance
     * @param req THe request object
     * @param res The response object
     * @param next THe next function
     * @param friendrequest_id The friend request id
     */
    paramcheckerFriendRequestID(req, res, next, friendrequest_id) {
        this.models.User.findOne({where: {id: friendrequest_id}}).then(maybeFriend => { //seaech for user
            // user will be the first entry of the Users table with matching parameter || null
            if (!maybeFriend) { //user does not exist
                MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {
                    error: 'friendrequest_id not found',
                    friendrequest_id: friendrequest_id
                });
                return;
            } else { //user found
                req.locals[this.friendrequest_resourceName] = maybeFriend; //save the found user
                let user = req.locals[this.resourceName]; //get our own
                user.getOutgoingFriendRequests().then(toBeFriends => { //get the friend request you are sending
                    req.locals.isOwnFriendRequest = false; //default its not your request
                    for (let i = 0; i < toBeFriends.length; i++) { //for all friend requests
                        let toCheck = toBeFriends[i];
                        if (toCheck.id === maybeFriend.id) { //if you match it
                            req.locals.isOwnFriendRequest = true; // okay check hes in users friendlist
                        }
                    }
                    next();
                    return;
                }).catch(err => {
                    this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] paramcheckerFriendRequestID - " + err.toString());
                    MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

                });
            }
        }).catch(err => {
            this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] paramcheckerFriendRequestID - " + err.toString());
            MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

        });
    };


    /**
     * Resource Routes
     */

    /**
     * @api {get} /api/usersAmount Get Amount of Users
     * @apiName AmountUsers
     * @apiPermission Anonym
     * @apiGroup User
     *
     * @apiSuccess {Number} amount The amount of registered users
     */
    handleGetAmount(req, res) {
        this.models.User.count().then(amount => {
            MyExpressRouter.responseWithJSON(res, HttpStatus.OK, amount);

        }).catch(err => {
            this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] handleGetAmount - " + err.toString());
            MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

        });
    }

    /**
     * @api {post} /api/users/:id/newToken Create AccessToken
     * @apiName CreateAccessToken
     * @apiPermission User
     * @apiUse SwosyPasswordAuthorization
     * @apiGroup User
     *
     * @apiParam {Number} id User's unique ID
     *
     * @apiSuccess {Boolean} successfully On success this is true
     * @apiSuccess {String} accessToken Here is the AccessToken
     *
     */
    handleGetNewToken(req, res) {
        let user = req.locals[this.resourceName];
        let user_id = user.id;
        let current_user_id = req.locals.current_user.id;
        req.locals.isOwnUser = user_id === current_user_id; // is it your own user ?

        let permission = this.myAccessControl.can(req.locals.current_user.role).createAny(MyExpressRouter.user_accessToken_accessControlResource); // can an admin or so do it?
        if (req.locals.isOwnUser) {
            permission = this.myAccessControl.can(req.locals.current_user.role).createOwn(MyExpressRouter.user_accessToken_accessControlResource); // can a user maybe do it?
        }

        this.logger.info("[" + this.myExpressRouter.workerID + "][UserController] handleGetNewToken - current_user_id: " + current_user_id + " user_id: " + user_id + " granted: " + permission.granted + " ownUser: " + req.locals.isOwnUser);

        if (permission.granted) { // can you create an access token ?
            user.update({
                online_time: new Date()
            }); //just try to update the online time
            this.models.UserRole.findOne({
                include: [{
                    model: this.models.Role, //the role is important for the access Token
                }],
                where: {UserId: user.id}
            }).then(userroleEntry => {
                let roleName = MyAccessControl.roleNameUser; //default role
                if (!!userroleEntry) { //if got a special role
                    let role = userroleEntry.Role; //get role
                    roleName = role.name; //save name
                }
                let token = this.myExpressRouter.tokenHelper.createToken(user_id, roleName); //create token
                let answer = {successfully: true, accessToken: token}; //create answer
                this.logger.info("[" + this.myExpressRouter.workerID + "][UserController] handleGetNewToken - current_user_id: " + current_user_id + " user_id: " + user_id + " successfully: " + answer.successfully + " roleName: " + roleName);
                MyExpressRouter.responseWithJSON(res, HttpStatus.OK, answer);
                return;
            }).catch(err => { //on any unexpected error
                console.log(err.toString());
                this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] handleGetNewToken - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

            });
        } else {
            this.logger.info("[" + this.myExpressRouter.workerID + "][UserController] handleGetNewToken - current_user_id: " + current_user_id + " user_id: " + user_id + " successfully: " + answer.successfully + " ownUser: " + req.locals.isOwnUser);
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to create AccessToken'
            });

        }
    }

    /**
     * @api {post} /api/users/:id/privacyPoliceRead Update Privacy Policy Read Timestamp
     * @apiName UserUpdatePrivacyPolicy
     * @apiPermission User
     * @apiUse SwosyPasswordAuthorization
     * @apiGroup User
     *
     * @apiParam {Number} id User's unique ID
     *
     * @apiSuccess {Boolean} successfully On success this is true
     * @apiSuccess {String} accessToken Here is the AccessToken
     *
     */
    handleUpdatePrivacyPolicy(req, res) {
        let user_id = req.locals[this.resourceName].id;
        let current_user_id = req.locals.current_user.id;

        let ownUser = req.locals.isOwnUser;
        if (ownUser) {
            this.logger.info("[" + this.myExpressRouter.workerID + "][UserController] handleUpdatePrivacyPolice - current_user_id: " + current_user_id + " user_id: " + user_id);
            let allowedAttributesToUpdate = {"privacyPoliceReadDate": new Date()}; //update this manualy, user should be allowed to change it directly
            req.locals[this.resourceName].update(allowedAttributesToUpdate).then((item => {
                let itemJSON = item.get({plain: true});
                MyExpressRouter.responseWithJSON(res, HttpStatus.OK, itemJSON);

            })).catch(err => {
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

            });
        } else {
            this.logger.info("[" + this.myExpressRouter.workerID + "][UserController] handleUpdatePrivacyPolice - current_user_id: " + current_user_id + " user_id: " + user_id);
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to update Resource',
                [resourceName + "_id"]: sequelizeResource.id
            });

        }
    }


    /**
     * Normal Routes
     */

    /**
     * @api {get} /api/users All Users
     * @apiName IndexUsers
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup User
     *
     * @apiSuccess {List[[User](#api-5Models-ModelUser)]} resources List of User Objects of all Users
     * @apiUse DefaultControllerIndex
     */
    handleIndex(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleIndex(req, res, this.models.User, this.myAccessControl, this.accessControlResource, this.resourceName);
    }

    /**
     * @api {get} /api/users Create User
     * @apiName CreateUser
     * @apiPermission Anonym
     * @apiGroup User
     *
     * @apiParam (Request message body) {String} plaintextSecret The Plaintext password for the User account
     *
     * @apiSuccess {Number} user_id The unique Id of the User.
     */
    handleCreate(req, res) {
        let permission = this.myAccessControl.can(req.locals.current_user.role).createOwn(this.accessControlResource); //check if guest is allowed to create a user for himself

        let ip = req.connection.remoteAddress; //this time we want to check if an ip is sending to much requests
        this.logger.info("[" + this.myExpressRouter.workerID + "][UserController] handleCreate - remoteAddress: " + ip);
        if (permission.granted) { //allowed to create new user
            let plaintextSecret = req.body.plaintextSecret; //get required plaintext secret
            if (!plaintextSecret) { //if no plaintext secret given
                this.logger.info("[" + this.myExpressRouter.workerID + "][UserController] handleCreate - plaintextSecret is missing");
                MyExpressRouter.responseWithJSON(res, HttpStatus.BAD_REQUEST, {error: "plaintextSecret is missing"});
                return;
            } else { //plaintext secret given
                this.models.User.create({ //create user with defaults
                    privacyPoliceReadDate: new Date(),
                    online_time: new Date(),
                }).then(savedUser => { //user is created
                    let salt = CryptoHelper.genSalt(); //get salt for password
                    let hashedSecretKey = CryptoHelper.hashSecret(plaintextSecret, salt); //create hashed secret

                    //okay now we need to link this user with a login
                    let login = this.models.Login.create({
                        UserId: savedUser.id,
                        hashedSecretKey: hashedSecretKey,
                        salt: hashedSecretKey
                    }).then(success => { //login saved successfully
                        let answer = {
                            user_id: savedUser.id
                        }; //create answer
                        MyExpressRouter.responseWithJSON(res, HttpStatus.OK, answer); // answer successfully
                        return;
                    }).catch(err => { //on any error we want to delete the created user
                        this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] handleCreate - " + err.toString());
                        savedUser.destroy(); //well atleast try to delete the unused user now
                        MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

                    });
                }).catch(err => {
                    this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] handleCreate - " + err.toString());
                    MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

                });
            }
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to create Resource: ' + this.accessControlResource
            });

        }
    }

    /**
     * @api {get} /api/users/:id Get User
     * @apiName GetUser
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup User
     *
     * @apiParam {Number} id User's unique ID
     *
     * @apiSuccess {[User](#api-5Models-ModelUser)} resource The User.
     * @apiUse DefaultControllerGet
     */
    handleGet(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleGet(req, res, this.myAccessControl, this.accessControlResource, this.resourceName, req.locals.isOwnUser);
    }

    /**
     * @api {post} /api/users/:id Update User
     * @apiName UpdateUser
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup User
     *
     * @apiParam {Number} id User's unique ID
     *
     * @apiParam (Request message body) {[User](#api-5Models-ModelUser)} prop Depending on [Permission](#api-Permission)
     *
     * @apiSuccess {[User](#api-5Models-ModelUser)} resource The updated user.
     * @apiUse DefaultControllerUpdate
     */
    handleUpdate(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleUpdate(req, res, this.myAccessControl, this.accessControlResource, this.resourceName, req.locals.isOwnUser);
    }

    /**
     * @api {delete} /api/user/:id Delete User
     * @apiName DeleteUser
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup User
     *
     * @apiParam {Number} id User's unique ID
     *
     * @apiUse DefaultControllerDelete
     */
    handleDelete(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleDelete(req, res, this.myAccessControl, this.accessControlResource, this.resourceName, req.locals.isOwnUser);
    }


    /**
     * Relations
     */

    /**
     * @api {get} /api/users/:id/device Get Device of User
     * @apiName GetDeviceOfUser
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup User
     *
     * @apiParam {Number} id User's unique ID
     *
     * @apiSuccess {Number} resource The [Device](#api-5Models-ModelDevice)'s Id.
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR
     * @apiError (Error) {String} error A description of the error
     */
    handleGetDevice(req, res) {
        let permission = this.myAccessControl.can(req.locals.current_user.role).updateAny(MyExpressRouter.device_accessControlResource);
        if (req.locals.isOwnUser) {
            permission = this.myAccessControl.can(req.locals.current_user.role).updateOwn(MyExpressRouter.device_accessControlResource);
        }
        if (permission.granted) { //can you get the device
            req.locals[this.resourceName].getDevice().then(device => {
                if (!device) { //no device found ?
                    MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {error: this.resourceName + ' device not found'});
                    return;
                } else { //device found
                    let deviceID = device.id; //return the ID //TODO: change this to a JSON
                    MyExpressRouter.responseWithJSON(res, HttpStatus.OK, deviceID);
                    return;
                }
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] handleGetDevice - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
                return;
            })
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to get Users Device',
                user_id: req.locals[this.resourceName].id
            });

        }
    }

    /**
     * UserFreinds
     */

    /**
     * @api {get} /api/users/:id/friends Get Users Friends
     * @apiName GetUsersFriends
     * @apiDescription A user can have a friendship with an other user. This lists all his friends
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup User
     *
     * @apiParam {Number} id User's unique ID
     *
     * @apiSuccess {List[[User](#api-5Models-ModelUser)]} resources The Friends [User](#api-5Models-ModelUser) as list.
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is that user does not exist.
     * @apiError (Error) {String} error A description of the error
     */
    handleGetFriends(req, res) {
        let permission = this.myAccessControl.can(req.locals.current_user.role).readAny(MyExpressRouter.friend_accessControlResource);
        if (req.locals.isOwnUser) {
            permission = this.myAccessControl.can(req.locals.current_user.role).readOwn(MyExpressRouter.friend_accessControlResource);
        }
        if (permission.granted) { //can you read all friends
            req.locals[this.resourceName].getFriends().then(friends => { //get users friends
                DefaultControllerHelper.respondWithPermissionFilteredResources(req, res, friends, permission);
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] handleGetFriends - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to get Users Friends',
                user_id: req.locals[this.resourceName].id
            });

        }
    }

    /**
     * @api {post} /api/users/:id/friends/:friend_id Create Users Friend
     * @apiName CreateUsersFriend
     * @apiDescription An Admin can force a friendship
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup User
     *
     * @apiParam {Number} id User's unique ID
     * @apiParam {Number} friend_id Friend's [User](#api-5Models-ModelUser) Id
     *
     * @apiUse UserHelperForceFriendShip
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is that user does not exist.
     * @apiError (Error) {String} error A description of the error
     */
    handleCreateFriend(req, res) {
        let permission = this.myAccessControl.can(req.locals.current_user.role).createAny(MyExpressRouter.friend_accessControlResource); // Admins can only force friendships
        // Users never can force/create a friendship

        if (permission.granted) { //Can someone realy FORCE a friendship ?
            let friend = req.locals[MyExpressRouter.friend_resourceName]; //get friend
            let user = req.locals[this.resourceName]; // get user
            this.helper_forceFriendShip(req, res, user, friend); //force friendship
            return;
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to create Users Friend',
                user_id: req.locals[this.resourceName].id
            });

        }
    }

    /**
     * Force a friendship between user and friend
     * @param req The request object
     * @param res The respond object
     * @param user The user which gets a friendship with friend
     * @param friend The friend which gets a friendship with user
     * @apiDefine UserHelperForceFriendShip
     * @apiSuccess {Number} friend_id The created Friend Id.
     */
    helper_forceFriendShip(req, res, user, friend) {
        user.addFriend(friend).then(success => { //add friend to user
            friend.addFriend(user).then(success => { //add user to friend
                MyExpressRouter.responseWithJSON(res, HttpStatus.OK, {friend_id: friend.id}); //respond with success
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] helper_forceFriendShip - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

            });
        }).catch(err => {
            this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] helper_forceFriendShip - " + err.toString());
            MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

        });
    }

    /**
     * @api {get} /api/users/:id/friends/:friend_id Get Users Friend
     * @apiName GetUsersFriend
     * @apiDescription A User can get more information about his friend with this action
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup User
     *
     * @apiParam {Number} id User's unique ID
     * @apiParam {Number} friend_id Friend's [User](#api-5Models-ModelUser) Id
     *
     * @apiSuccess {[User](#api-5Models-ModelUser)} resource The Users Friend.
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is no friendship or that user does not exist.
     * @apiError (Error) {String} error A description of the error
     */
    handleGetFriend(req, res) {
        let permission = this.myAccessControl.can(req.locals.current_user.role).readAny(MyExpressRouter.friend_accessControlResource);
        if (req.locals.isOwnUser && req.locals.isOwnFriend) { //own user and own friend, otherwise you need to be admin
            permission = this.myAccessControl.can(req.locals.current_user.role).readOwn(MyExpressRouter.friend_accessControlResource);
        }

        if (permission.granted) { //can read a friends profile
            let friend = req.locals[MyExpressRouter.friend_resourceName]; //get the friend
            let user = req.locals[this.resourceName]; //get the user

            user.hasFriend(friend).then(associated => { //check if its his friend
                if (associated) { //if it is
                    DefaultControllerHelper.respondWithPermissionFilteredResource(req, res, friend, permission);
                    return;
                } else {
                    MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {
                        error: 'user_id not friend with',
                        friend_id: friend.id
                    });
                    return;
                }
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] handleGetFriend - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to get Users Friend',
                user_id: req.locals[this.resourceName].id
            });
            return;
        }
    }

    /**
     * @api {delete} /api/users/:id/friends/:user_id Delete Users Friend
     * @apiName DeleteUsersFriend
     * @apiDescription To remove a users friend this Endpoint can be used.
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup User
     *
     * @apiParam {Number} id User's unique ID
     * @apiParam {Number} friend_id Friend's [User](#api-5Models-ModelUser) Id
     *
     * @apiSuccess {Boolean} success On success this is true
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is that user does not exist.
     * @apiError (Error) {String} error A description of the error
     */
    handleDeleteFriend(req, res) {
        let permission = this.myAccessControl.can(req.locals.current_user.role).deleteAny(MyExpressRouter.friend_accessControlResource);
        if (req.locals.isOwnUser && req.locals.isOwnFriend) { //own user and own friend, otherwise you need to be admin
            permission = this.myAccessControl.can(req.locals.current_user.role).deleteOwn(MyExpressRouter.friend_accessControlResource);
        }

        if (permission.granted) { //can delete friendship
            let friend = req.locals[MyExpressRouter.friend_resourceName]; //get friend
            let user = req.locals[this.resourceName]; //get user

            user.hasFriend(friend).then(associated => {
                if (associated) { //if user is befriended
                    user.removeFriend(friend).then(success => { //remove each other
                        friend.removeFriend(user).then(success => {
                            DefaultControllerHelper.respondWithDeleteMessage(req,res);
                            return;
                        }).catch(err => {
                            this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] handleDeleteFriend - " + err.toString());
                            MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
                            return;
                        });
                    }).catch(err => {
                        this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] handleDeleteFriend - " + err.toString());
                        MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
                        return;
                    });
                } else {
                    MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {
                        error: 'user_id not friend with',
                        friend_id: friend.id
                    });
                    return;
                }
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] handleDeleteFriend - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
                return;
            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to delete Users Friend',
                user_id: req.locals[this.resourceName].id
            });
            return;
        }
    }


    /**
     * UserFriendRequests
     */

    /**
     * @api {get} /api/users/:id/friendrequests Get Users Outgoing FriendRequests
     * @apiName GetUsersFriendRequests
     * @apiDescription All outgoing FriendRequests a user created
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup User
     *
     * @apiParam {Number} id User's unique ID
     *
     * @apiSuccess {List[[User](#api-5Models-ModelUser)]} resources The Outgoing FriendRequest [User](#api-5Models-ModelUser)'s as list.
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is that user does not exist.
     * @apiError (Error) {String} error A description of the error
     */
    handleGetFriendRequests(req, res) {
        let permission = this.myAccessControl.can(req.locals.current_user.role).readAny(MyExpressRouter.friendrequest_accessControlResource);
        if (req.locals.isOwnUser) {
            permission = this.myAccessControl.can(req.locals.current_user.role).readOwn(MyExpressRouter.friendrequest_accessControlResource);
        }
        if (permission.granted) { //if can read all friendrequests
            req.locals[this.resourceName].getOutgoingFriendRequests().then(resources => { //get all outgoing friend requests
                DefaultControllerHelper.respondWithPermissionFilteredResources(req, res, resources, permission);
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] handleGetFriendRequests - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to get Users FriendRequests',
                user_id: req.locals[this.resourceName].id
            });

        }
    }

    /**
     * @api {post} /api/users/:id/friendrequests/:friend_id Create User FriendRequest
     * @apiName CreateUserFriendRequest
     * @apiDescription A user can create a friend request to an other user. If both users created a request to each other, they become friends and their requests will be deleted
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup User
     *
     * @apiParam {Number} id User's unique ID
     * @apiParam {Number} friend_id Outgoing FriendRequest's [User](#api-5Models-ModelUser) Id
     *
     * @apiUse UserHelperForceFriendShip
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is that user does not exist.
     * @apiError (Error) {String} error A description of the error
     */
    handleCreateFriendRequest(req, res) {
	this.logger.info("[" + this.myExpressRouter.workerID + "][UserController] handleCreateFriendRequest - start");
        let permission = this.myAccessControl.can(req.locals.current_user.role).createAny(MyExpressRouter.friendrequest_accessControlResource); // Admins can only force friendships
        if (req.locals.isOwnUser) {
            permission = this.myAccessControl.can(req.locals.current_user.role).createOwn(MyExpressRouter.friendrequest_accessControlResource);
        }
	this.logger.info("[" + this.myExpressRouter.workerID + "][UserController] handleCreateFriendRequest - check permission");
        if (permission.granted) {
            let maybeFriend = req.locals[MyExpressRouter.friendrequest_resourceName]; //get the friend to be added
            let user = req.locals[this.resourceName]; //get user
	    this.logger.info("[" + this.myExpressRouter.workerID + "][UserController] handleCreateFriendRequest -" + user.id+ " --> "+maybeFriend.id);

            user.addOutgoingFriendRequests(maybeFriend).then(success => { //user adds the other as friend
		this.logger.info("[" + this.myExpressRouter.workerID + "][UserController] handleCreateFriendRequest - added outgoing friendrequest");
                maybeFriend.hasOutgoingFriendRequest(user).then(otherHasUserAlreadyAdded => { //lets check if the other already did that
		    this.logger.info("[" + this.myExpressRouter.workerID + "][UserController] handleCreateFriendRequest - check if both have requests");
                    if (otherHasUserAlreadyAdded) { //if they added each other, then they are friends
                        return this.helper_friendRequestMatched(req, res, user, maybeFriend);
                        //we end here, because we dont want send the friendrequest answer, instead the friend answer
                    } else { //otherwise the user has created a friendrequest successfully
                        return MyExpressRouter.responseWithJSON(res, HttpStatus.OK, {friendrequest_id: maybeFriend.id});
                    }
                }).catch(err => {
                    this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] handleCreateFriendRequest - " + err.toString());
                    MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

                });
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] handleCreateFriendRequest - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to create Users FriendRequest',
                user_id: req.locals[this.resourceName].id
            });

        }
    }

    /**
     * This helper Method removes friendrequests and then forces a friendship
     * @param req The request object
     * @param res The respond object
     * @param user The user which gets befriended with toBeFriend
     * @param toBeFriend The toBeFriend which gets befriended with user
     * @returns {Promise<void>}
     */
    async helper_friendRequestMatched(req, res, user, toBeFriend) {
        //first lets remove the friendrequests for both
	this.logger.info("[" + this.myExpressRouter.workerID + "][UserController] helper_friendRequestMatched");
        user.removeOutgoingFriendRequests(toBeFriend).then(success => {
            toBeFriend.removeOutgoingFriendRequests(user).then(success => {
                //so now that both requests are removed, we need to force a friendship
                this.helper_forceFriendShip(req, res, user, toBeFriend);

            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] helper_friendRequestMatched - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

            });
        }).catch(err => {
            this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] helper_friendRequestMatched - " + err.toString());
            MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

        });
    }

    /**
     * @api {get} /api/users/:id/friendrequests/:friend_id Get Users FriendRequest
     * @apiName GetUsersFriendRequest
     * @apiDescription A User can check if there is a friend request to a specific user
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup User
     *
     * @apiParam {Number} id User's unique ID
     * @apiParam {Number} friend_id To check outgoing FriendRequest's [User](#api-5Models-ModelUser) Id
     *
     * @apiSuccess {[User](#api-5Models-ModelUser)} resource The Users on his FriendRequest list.
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is no friend request outgoing to that user or that user does not exist.
     * @apiError (Error) {String} error A description of the error
     */
    handleGetFriendRequest(req, res) {
        let permission = this.myAccessControl.can(req.locals.current_user.role).readAny(MyExpressRouter.friendrequest_accessControlResource);
        if (req.locals.isOwnUser && req.locals.isOwnFriendRequest) { //own user and own friend, otherwise you need to be admin
            permission = this.myAccessControl.can(req.locals.current_user.role).readOwn(MyExpressRouter.friendrequest_accessControlResource);
        }
        if (permission.granted) { // if can check if there is an outgoing friendrequest
            let toBeFriend = req.locals[MyExpressRouter.friendrequest_resourceName]; //get the tocheck friend
            let user = req.locals[this.resourceName]; //get the user

            user.hasOutgoingFriendRequest(toBeFriend).then(associated => { //check if has friendrequest
                if (associated) { //if has friendrequest
                    DefaultControllerHelper.respondWithPermissionFilteredResources(req, res, toBeFriend, permission);
                } else {
                    MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {
                        error: 'user_id has not send any friendrequest with',
                        friend_id: toBeFriend.id
                    });
                }
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] handleGetFriendRequest - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to get Users FriendRequest',
                user_id: req.locals[this.resourceName].id
            });

        }
    }

    /**
     * @api {delete} /api/users/:id/friendrequests/:user_id Delete Users FriendRequest
     * @apiName DeleteUsersFriendRequest
     * @apiDescription To delete a users friendrequest this Endpoint can be used.
     * @apiPermission User
     * @apiUse SwosyAuthorization
     * @apiGroup User
     *
     * @apiParam {Number} id User's unique ID
     * @apiParam {Number} friend_id Friend's [User](#api-5Models-ModelUser) Id
     *
     * @apiSuccess {Boolean} success On success this is true
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND. NOT_FOUND will be received if there is that user does not exist.
     * @apiError (Error) {String} error A description of the error
     */
    handleDeleteFriendRequest(req, res) {
        let permission = this.myAccessControl.can(req.locals.current_user.role).deleteAny(MyExpressRouter.friendrequest_accessControlResource);
        if (req.locals.isOwnUser && req.locals.isOwnFriendRequest) { //own user and own friend, otherwise you need to be admin
            permission = this.myAccessControl.can(req.locals.current_user.role).deleteOwn(MyExpressRouter.friendrequest_accessControlResource);
        }
        if (permission.granted) { //can delete friend request
            let friend = req.locals[MyExpressRouter.friendrequest_resourceName]; //get friend
            let user = req.locals[this.resourceName]; //get user

            user.hasOutgoingFriendRequest(friend).then(associated => {
                if (associated) { //has friendrequest send ?
                    user.removeOutgoingFriendRequests(friend).then(success => { //then remove
                        DefaultControllerHelper.respondWithDeleteMessage(req,res);
                    }).catch(err => {
                        this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] handleDeleteFriendRequest - " + err.toString());
                        MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

                    });
                } else { //user has no outgoing friendrequest
                    MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {
                        error: 'user_id has not send any fruendrequest with',
                        friend_id: friend.id
                    });
                }
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][UserController] handleDeleteFriendRequest - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});

            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to delete Users FriendRequest',
                user_id: req.locals[this.resourceName].id
            });

        }
    }

}
