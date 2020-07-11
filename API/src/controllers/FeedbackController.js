import MyExpressRouter from "../module/MyExpressRouter";

export default class FeedbackController {

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
        this.resource_id_parameter = MyExpressRouter.feedback_resource_id_parameter;
        this.routeResources = MyExpressRouter.feedback_routeResources;
        this.routeResource = MyExpressRouter.feedback_routeResource;
        this.accessControlResource = MyExpressRouter.feedback_accessControlResource;
        this.resourceName = MyExpressRouter.feedback_resourceName;
    }

    configureRoutes() {
        //Param Checker
        this.expressApp.param(this.resource_id_parameter, this.paramcheckerResourceId.bind(this));

        //Resources
        this.expressApp.get(this.routeResources, this.handleIndex.bind(this)); //Create

        //Resource
        this.expressApp.post(this.routeResources, this.handleCreate.bind(this)); //Create
        this.expressApp.get(this.routeResource, this.handleGet.bind(this)); //Read
        this.expressApp.post(this.routeResource, this.handleUpdate.bind(this)); //Update
        this.expressApp.delete(this.routeResource, this.handleDelete.bind(this)); //Delete

    }

    paramcheckerResourceId(req, res, next, resource_id) {
        this.myExpressRouter.defaultControllerHelper.paramcheckerResourceId(req, res, next, resource_id, this.models.Feedback, this.accessControlResource, this.resourceName);
    };

    /**
     * Routes
     */

    /**
     * @api {get} /api/feedbacks All Feedbacks
     * @apiName IndexFeedbacks
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Feedback
     *
     * @apiSuccess {List[[Feedback](#api-5Models-ModelFeedback)]} resources List of Feedback Objects of all Feedback.
     * @apiUse DefaultControllerIndex
     */
    handleIndex(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleIndex(req, res, this.models.Feedback, this.myAccessControl, this.accessControlResource, this.resourceName);
    }

    /**
     * @api {post} /api/feedbacks Create Feedback
     * @apiName CreateFeedback
     * @apiPermission Anonym
     * @apiGroup Feedback
     *
     * @apiParam (Request message body) {String} [message] The message of the feedback
     * @apiParam (Request message body) {String} [label] A label for the message
     *
     * @apiSuccess {[Feedback](#api-5Models-ModelFeedback)} resource The feedback.
     * @apiUse DefaultControllerCreate
     */
    handleCreate(req, res) {
        //TODO check if no message and label given ...
        let resource = this.models.Feedback.build({message: req.body.message, label: req.body.label});
        this.myExpressRouter.defaultControllerHelper.handleCreate(req, res, resource, this.myAccessControl, this.accessControlResource, this.resourceName, true, false);
    }

    /**
     * @api {get} /api/feedbacks/:id Get Feedback
     * @apiName GetFeedback
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Feedback
     *
     * @apiParam {Number} id Feedback's unique ID.
     *
     * @apiSuccess {[Feedback](#api-5Models-ModelFeedback)} resource The feedback.
     * @apiUse DefaultControllerGet
     */
    handleGet(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleGet(req, res, this.myAccessControl, this.accessControlResource, this.resourceName, false);
    }

    /**
     * @api {post} /api/feedbacks/:id Update Feedback
     * @apiName UpdateFeedback
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Feedback
     *
     * @apiParam {Number} id Feedback's unique ID.
     *
     * @apiParam (Request message body) {[Feedback](#api-5Models-ModelFeedback)} prop Depending on [Permission](#api-Permission)
     *
     * @apiSuccess {[Feedback](#api-5Models-ModelFeedback)} resource The updated feedback.
     * @apiUse DefaultControllerUpdate
     */
    handleUpdate(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleUpdate(req, res, this.myAccessControl, this.accessControlResource, this.resourceName, false, false);
    }

    /**
     * @api {delete} /api/feedback/:id Delete Feedback
     * @apiName DeleteFeedback
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Feedback
     *
     * @apiParam {Number} id Feedback's unique ID.
     *
     * @apiUse DefaultControllerDelete
     */
    handleDelete(req, res) {
        this.myExpressRouter.defaultControllerHelper.handleDelete(req, res, this.myAccessControl, this.accessControlResource, this.resourceName, false, false);
    }

}
