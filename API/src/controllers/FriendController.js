import MyExpressRouter from "../module/MyExpressRouter";

export default class FriendController {

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
        this.routeResources = MyExpressRouter.friend_routeResources;
        this.accessControlResource = MyExpressRouter.friend_accessControlResource;
        this.resourceName = MyExpressRouter.friend_resourceName;
    }

    configureRoutes() {
        //Resources
        this.expressApp.get(this.routeResources, this.handleIndex.bind(this)); //Create
    }

    /**
     * @api {get} /api/friends All Friends
     * @apiName IndexFriends
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Friends
     *
     * @apiSuccess {List[[Friend](#api-5Models-ModelFriend)]} resources List of Friend Objects of all Friend.
     * @apiUse DefaultControllerIndex
     */
    handleIndex(req, res) {
        let redisKey = this.routeResources;
        this.myExpressRouter.defaultControllerHelper.handleIndex(req, res, this.models.sequelize.models.UserFriends, this.myAccessControl, this.accessControlResource, this.resourceName, [], redisKey);
    }
}
