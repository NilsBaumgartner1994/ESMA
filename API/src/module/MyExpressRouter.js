const config = require("./../config.json")["server"];

import HttpStatus from 'http-status-codes';
import SystemInformationHelper from '../helper/SystemInformationHelper';

import DeviceController from "../controllers/DeviceController";
import FriendController from "../controllers/FriendController";
import LoginController from "../controllers/LoginController";
import PermissionController from "../controllers/PermissionController";
import RoleController from "../controllers/RoleController";
import StreamViewController from "../controllers/StreamViewController";
import UserController from "../controllers/UserController";
import UserRoleController from "../controllers/UserRoleController";
import FeedbackController from "../controllers/FeedbackController";

import MyTokenHelper from "../helper/MyTokenHelper";
import MetricsHelper from "../helper/MetricsHelper";
import DateHelper from "../helper/DateHelper";
import DefaultPhotoHelper from "../helper/DefaultPhotoHelper";
import DefaultControllerHelper from "../helper/DefaultControllerHelper";
import Function_BackupController from "../controllers/Function_BackupController";
import MyAccessControl from "./MyAccessControl";

const fileUpload = require('express-fileupload');
const fs = require("fs"); //file-system
const fetch = require("node-fetch");

let maxFileUploadSize = 50 * 1024 * 1024; //max file upload in MB
var bodyParser = require('body-parser'); //a parser for requests with body data

/**
 * The My Express Router which is the core functionality. It setups all controllers and handles routes
 */
export default class MyExpressRouter {

    static urlAPI = "/api"; //the api url
    static serverAPIVersion = config.serverAPIVersion; //the server version https://semver.org/

    static redisClient = null; //the redis client

    static days_parameter = "date"; //parameter name for dates

    /***************************************
     ************ Routes *******************
     **************************************/
    static routeVersion = MyExpressRouter.urlAPI + "/version";
    static routeFunctions = MyExpressRouter.urlAPI + "/functions";

    /**
     * 1. Declare a new Resource Name, a Parameter, AccessControll Resource, and RouteIdentifier
     */

        // Functions

    static function_backup_resource_id_parameter = "backup_id";
    static function_backup_routeIdentifier = "/backups";
    static function_backup_resourceName = "backup";
    static function_backup_accessControlResouce = "Function_Backup";

    static function_database_resourceName = "database";
    static function_database_accessControlResource = "Function_Database";


    // Tables

    static building_resource_id_parameter = "building_id";
    static building_routeIdentifier = "/buildings";
    static building_resourceName = "building";
    static building_accessControlResource = "Building";

    static canteen_resource_id_parameter = "canteen_id";
    static canteen_routeIdentifier = "/canteens";
    static canteen_resourceName = "canteen";
    static canteen_accessControlResource = "Canteen";

    static device_resource_id_parameter = "device_id";
    static device_routeIdentifier = "/devices";
    static device_resourceName = "device";
    static device_accessControlResource = "Device";

    static friend_resource_id_parameter = "friend_id";
    static friend_routeIdentifier = "/friends";
    static friend_resourceName = "friend";
    static friend_accessControlResource = "Friend";

    static feedback_resource_id_parameter = "feedback_id";
    static feedback_routeIdentifier = "/feedbacks";
    static feedback_resourceName = "feedback";
    static feedback_accessControlResource = "Feedback";

    static friendrequest_resource_id_parameter = "friendrequest_id";
    static friendrequest_routeIdentifier = "/friendrequests";
    static friendrequest_resourceName = "friendrequest";
    static friendrequest_accessControlResource = "FriendRequest";

    static information_resource_id_parameter = "information_id";
    static information_routeIdentifier = "/informations";
    static information_resourceName = "information";
    static information_accessControlResource = "Information";

    static login_resource_id_parameter = "login_id";
    static login_routeIdentifier = "/logins";
    static login_resourceName = "login";
    static login_accessControlResource = "Login";

    static tableUpdateTimes_accessControlResource = "TableUpdateTimes";
    static tableUpdateTimes_routeIdentifier = "/tableUpdateTimes";
    static tableUpdateTimes_resourceName = "TableUpdateTime";

    static marking_resource_id_parameter = "marking_id";
    static marking_routeIdentifier = "/markings";
    static marking_resourceName = "marking";
    static marking_accessControlResource = "Marking";

    static meal_resource_id_parameter = "meal_id";
    static meal_routeIdentifier = "/meals";
    static meal_resourceName = "meal";
    static meal_accessControlResource = "Meal";

    static mealcomment_resource_id_parameter = "mealcomment_id";
    static mealcomment_routeIdentifier = "/mealcomments";
    static mealcomment_resourceName = "mealcomment";
    static mealcomment_accessControlResource = "MealComment";

    static mealrating_resource_id_parameter = "mealrating_id";
    static mealrating_routeIdentifier = "/mealratings";
    static mealrating_resourceName = "mealrating";
    static mealrating_accessControlResource = "MealRating";

    static meeting_resource_id_parameter = "meeting_id";
    static meeting_routeIdentifier = "/meetings";
    static meeting_resourceFindIdentifier = "/meetingFind";
    static meeting_resourceName = "meeting";
    static meeting_accessControlResource = "Meeting";

    static news_resource_id_parameter = "news_id";
    static news_routeIdentifier = "/news";
    static news_resourceName = "news";
    static news_accessControlResource = "News";

    static order_resource_id_parameter = "order_id";
    static order_routeIdentifier = "/orders";
    static order_resourceName = "order";
    static order_accessControlResource = "Orders";

    static orderdetail_resource_id_parameter = "orderdetail_id";
    static orderdetail_routeIdentifier = "/orderdetails";
    static orderdetail_resourceName = "orderdetail";
    static orderdetail_accessControlResource = "OrderDetail";

    static permissions_routeIdentifier = "/permissions";
    static permissions_resourceName = "permissions";
    static permissions_accessControlResource = "Permissions";

    static residence_resource_id_parameter = "residence_id";
    static residence_routeIdentifier = "/residences";
    static residence_resourceName = "residence";
    static residence_accessControlResource = "Residence";

    static role_resource_id_parameter = "role_id";
    static role_routeIdentifier = "/roles";
    static role_resourceName = "role";
    static role_accessControlResource = "Role";

    static streamview_resource_id_parameter = "streamview_id";
    static streamview_routeIdentifier = "/streamviews";
    static streamview_resourceName = "streamview";
    static streamview_accessControlResource = "StreamView";

    static user_resource_id_parameter = "user_id";
    static user_routeIdentifier = "/users";
    static user_resourceName = "user";
    static user_accessControlResource = "User";
    static user_accessToken_accessControlResource = "AccessToken";
    static user_favoriteMeals_accessControlResource = "UserFavoriteMeal";

    static userWasherNotification_routeIdentifier = "/washerNotifications";
    static userWasherNotification_accessControlResource = "UserWasherNotification";

    static userrole_routeIdentifier = "/userroles";
    static userrole_resourceName = "userrole";
    static userrole_accessControlResource = "UserRole";

    static university_resource_id_parameter = "university_id";
    static university_routeIdentifier = "/universities";
    static university_resourceName = "university";
    static university_accessControlResource = "University";

    static washer_resource_id_parameter = "washer_id";
    static washer_routeIdentifier = "/washers";
    static washer_resourceName = "washer";
    static washer_accessControlResource = "Washer";

    static washerjob_resource_id_parameter = "washerjob_id";
    static washerjob_routeIdentifier = "/washerjobs";
    static washerjob_resourceName = "washerjob";
    static washerjob_accessControlResource = "WasherJob";

    static userMarking_accessControlResource = "UserMarkings";
    static markingUsers_accessControlResource = "MarkingUsers";

    /**
     * 2. Create the Route and Associations
     */

        //Functions

    static function_routeBackups = MyExpressRouter.routeFunctions + MyExpressRouter.function_backup_routeIdentifier;
    static function_routeBackupCreate = MyExpressRouter.function_routeBackups + "create";
    static function_routeBackup = MyExpressRouter.function_routeBackups + "/:" + MyExpressRouter.function_backup_resource_id_parameter;
    static function_routeBackupDownload = MyExpressRouter.function_routeBackup + "/download";
    static function_routeBackupRestore = MyExpressRouter.function_routeBackup + "/restore";

    // Tables

    static building_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.building_routeIdentifier;
    static building_routeResource = MyExpressRouter.building_routeResources + "/:" + MyExpressRouter.building_resource_id_parameter;
    static building_routeResourcePhotos = MyExpressRouter.building_routeResource + "/photos";

    static canteen_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.canteen_routeIdentifier;
    static canteen_routeResource = MyExpressRouter.canteen_routeResources + "/:" + MyExpressRouter.canteen_resource_id_parameter;
    static canteen_routeCanteenAtDay = MyExpressRouter.canteen_routeResource + "/days/:" + MyExpressRouter.days_parameter;
    static canteen_routeCanteenMealsAtDay = MyExpressRouter.canteen_routeCanteenAtDay + "/meals";
    static canteen_routeCanteenPopularTimeAtDay = MyExpressRouter.canteen_routeCanteenAtDay + "/populartimes";

    static device_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.device_routeIdentifier;
    static device_routeResource = MyExpressRouter.device_routeResources + "/:" + MyExpressRouter.device_resource_id_parameter;
    static device_routeStreamViews = MyExpressRouter.device_routeResource + MyExpressRouter.streamview_routeIdentifier;

    static feedback_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.feedback_routeIdentifier;
    static feedback_routeResource = MyExpressRouter.feedback_routeResources + "/:" + MyExpressRouter.feedback_resource_id_parameter;

    static friend_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.friend_routeIdentifier;

    static information_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.information_routeIdentifier;
    static information_routeResource = MyExpressRouter.information_routeResources + "/:" + MyExpressRouter.information_resource_id_parameter;

    static login_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.login_routeIdentifier;
    static login_routeResource = MyExpressRouter.login_routeResources + "/:" + MyExpressRouter.login_resource_id_parameter;

    static marking_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.marking_routeIdentifier;
    static marking_routeResource = MyExpressRouter.marking_routeResources + "/:" + MyExpressRouter.marking_resource_id_parameter;
    static marking_routeAssociationUsers = MyExpressRouter.marking_routeResource + "/users";

    static tableUpdateTimes_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.tableUpdateTimes_routeIdentifier;

    static meal_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.meal_routeIdentifier;
    static meal_routeResource = MyExpressRouter.meal_routeResources + "/:" + MyExpressRouter.meal_resource_id_parameter;
    static meal_routeResourcePhotos = MyExpressRouter.meal_routeResource + "/photos";
    static meal_routeResourceUsersFavorite = MyExpressRouter.meal_routeResource + "/usersFavorite"; //TODO Implement to see for a meal, which users like it

    static mealcomment_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.mealcomment_routeIdentifier;
    static mealcomment_routeResource = MyExpressRouter.mealcomment_routeResources + "/:" + MyExpressRouter.mealcomment_resource_id_parameter;

    static mealrating_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.mealrating_routeIdentifier;
    static mealrating_routeResource = MyExpressRouter.mealrating_routeResources + "/:" + MyExpressRouter.mealrating_resource_id_parameter;

    static meeting_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.meeting_routeIdentifier;
    static meeting_routeResource = MyExpressRouter.meeting_routeResources + "/:" + MyExpressRouter.meeting_resource_id_parameter;
    static meeting_routeResourcFind = MyExpressRouter.urlAPI + MyExpressRouter.meeting_resourceFindIdentifier;

    static news_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.news_routeIdentifier;
    static news_routeResource = MyExpressRouter.news_routeResources + "/:" + MyExpressRouter.news_resource_id_parameter;

    static order_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.order_routeIdentifier;
    static order_routeResource = MyExpressRouter.order_routeResources + "/:" + MyExpressRouter.order_resource_id_parameter;

    static orderdetail_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.orderdetail_routeIdentifier;
    static orderdetail_routeResource = MyExpressRouter.orderdetail_routeResources + "/:" + MyExpressRouter.orderdetail_resource_id_parameter;

    static permission_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.permissions_routeIdentifier;
    static permission_routeOwn = MyExpressRouter.permission_routeResources + "/own";

    static residence_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.residence_routeIdentifier;
    static residence_routeResource = MyExpressRouter.residence_routeResources + "/:" + MyExpressRouter.residence_resource_id_parameter;
    static residence_routeResourceWashers = MyExpressRouter.residence_routeResource + "/washers";
    static residence_routeAssociationUsersAccessControll = "ResidenceUsers";
    static residence_routeAssociationUsers = MyExpressRouter.residence_routeResource + "/users";

    static role_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.role_routeIdentifier;
    static role_routeResource = MyExpressRouter.role_routeResources + "/:" + MyExpressRouter.role_resource_id_parameter;

    static streamview_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.streamview_routeIdentifier;
    static streamview_routeResource = MyExpressRouter.streamview_routeResources + "/:" + MyExpressRouter.streamview_resource_id_parameter;

    static user_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.user_routeIdentifier;
    static user_routeResource = MyExpressRouter.user_routeResources + "/:" + MyExpressRouter.user_resource_id_parameter;
    static user_routeAmount = MyExpressRouter.urlAPI + "/usersAmount";
    static user_routeUserGetNewToken = MyExpressRouter.user_routeResource + "/newToken";
    static user_routeUserPrivacyPolicyRead = MyExpressRouter.user_routeResource + "/privacyPoliceRead";
    static user_routeUsersDevice = MyExpressRouter.user_routeResource + "/device";
    static user_routeUsersFavoriteMeals = MyExpressRouter.user_routeResource + "/favoriteMeals";
    static user_routeUsersFavoriteMeal = MyExpressRouter.user_routeUsersFavoriteMeals + "/:" + MyExpressRouter.meal_resource_id_parameter;
    static user_routeUsersFriends = MyExpressRouter.user_routeResource + "/friends";
    static user_routeUsersFriend = MyExpressRouter.user_routeUsersFriends + "/:" + MyExpressRouter.friend_resource_id_parameter;
    static user_routeUsersFriendRequests = MyExpressRouter.user_routeResource + "/friendrequests";
    static user_routeUsersFriendRequest = MyExpressRouter.user_routeUsersFriendRequests + "/:" + MyExpressRouter.friendrequest_resource_id_parameter;
    static user_routeMarkings = MyExpressRouter.user_routeResource + MyExpressRouter.marking_routeIdentifier;
    static user_routeMarking = MyExpressRouter.user_routeMarkings + "/:" + MyExpressRouter.marking_resource_id_parameter;
    static user_routeWasherNotifications = MyExpressRouter.user_routeResource + MyExpressRouter.userWasherNotification_routeIdentifier;
    static user_routeWasherNotification = MyExpressRouter.user_routeWasherNotifications + "/:" + MyExpressRouter.washer_resource_id_parameter;

    static userrole_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.userrole_routeIdentifier;
    static userrole_routeResource = MyExpressRouter.userrole_routeResources + "/user/:" + MyExpressRouter.user_resource_id_parameter + "/role/:" + MyExpressRouter.role_resource_id_parameter;
    static userrole_routeResourceForUser = MyExpressRouter.userrole_routeResources + "/user/:" + MyExpressRouter.user_resource_id_parameter;

    static university_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.university_routeIdentifier;
    static university_routeResource = MyExpressRouter.university_routeResources + "/:" + MyExpressRouter.university_resource_id_parameter;
    static university_routeResourceBuildings = MyExpressRouter.university_routeResource + MyExpressRouter.building_routeIdentifier;
    static university_routeResourceBuilding = MyExpressRouter.university_routeResourceBuildings + "/:" + MyExpressRouter.building_resource_id_parameter;

    static washer_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.washer_routeIdentifier;
    static washer_routeResource = MyExpressRouter.washer_routeResources + "/:" + MyExpressRouter.washer_resource_id_parameter;
    static washer_routeAssociationWasherJobAccessControll = "WasherWasherJobs";
    static washer_routeAssociationWasherJobs = MyExpressRouter.washer_routeResource + MyExpressRouter.washerjob_routeIdentifier;

    static washerjob_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.washerjob_routeIdentifier;
    static washerjob_routeResource = MyExpressRouter.washerjob_routeResources + "/:" + MyExpressRouter.washerjob_resource_id_parameter;

    /**
     * Custom Routes
     */
    static custom_routeIdentifier = "/custom";
    static custom_routeResources = MyExpressRouter.urlAPI + MyExpressRouter.custom_routeIdentifier;

    //Define a ControlResource for general purpose for admins
    static adminRoutes_accessControlResource = "AdminFunctions";

    static custom_routeMetrics = MyExpressRouter.custom_routeResources + "/metrics";
    static custom_bugReport = MyExpressRouter.custom_routeResources + "/bugReport";
    static custom_mealPhotoOfSchnellerTellerWesterberg = MyExpressRouter.custom_routeResources + "/photoSchnellerTellerWesterberg";
    static custom_showAllEndpoints = MyExpressRouter.custom_routeResources + "/showAllEndpoints";
    static custom_routeSystemInformation = MyExpressRouter.custom_routeResources + "/systemInformation";
    static custom_routeSendPushNotification = MyExpressRouter.custom_routeResources + "/sendNotification";

    /**
     * API
     */

    /**
     * Constructor of the MyExpressRouter
     * @param workerID The worker ID, since there are cluster workers
     * @param logger The logger class
     * @param bugReportLogger The bug Report logger
     * @param firebaseAPI the firebase api
     * @param expressApp the express app itseld
     * @param models the sequelize models
     * @param myAccessControl the access controll instance
     * @param redisClient the redis client
     */
    constructor(workerID, logger, bugReportLogger, firebaseAPI, expressApp, models, myAccessControl, redisClient) {
        this.workerID = workerID;
        this.logger = logger;
        this.bugReportLogger = bugReportLogger;
        this.logger.info("[MyExpressRouter] initialising");
        this.models = models;
        this.firebaseAPI = firebaseAPI;
        this.expressApp = expressApp;
        this.myAccessControl = myAccessControl;
        MyExpressRouter.redisClient = redisClient;

        this.tokenHelper = new MyTokenHelper(logger); //create the token helper
        this.configureExpressApp(); //configure parameters like which requests are allowed
        this.configureController(); //configure the routes
        this.logger.info("[MyExpressRouter] initialised");
    }

    /**
     * Respond Helpers
     */

    /**
     * Response with JSON to a request
     * @param res The response object
     * @param status the status
     * @param jsonData the json data
     */
    static responseWithJSON(res, status, jsonData) {
        res.status(status);
        res.header('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        let jsonString = JSON.stringify(jsonData);
        res.end(jsonString);

    }

    /**
     * Response to a file Upload
     * @param res the response object
     * @param status the status
     */
    static responseToFileUpload(res, status) {
        res.status(status);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        res.end();
    }

    /**
     * A Parameter Checker for Dates
     * @param req the request object
     * @param res the response object
     * @param next the next function
     * @param date the date to be checked
     * @returns boolean next function on success, else response with error and false
     */
    static paramcheckerDay(req, res, next, date) {
        let matches = /^(\d{1,2})[-](\d{1,2})[-](\d{4})$/.exec(date); //does date matches the regex DD-DD-DDDD ?
        if (matches == null) return false;
        let d = matches[1]; //get day
        let m = matches[2]; //get month
        let y = matches[3]; //get year

        let validDate = DateHelper.validateAndFormatDate(d, m, y); //is this a valid date ?
        if (!validDate) { //if not valid date
            MyExpressRouter.responseWithJSON(res, HttpStatus.BAD_REQUEST, {error: 'date has wrong format', date: date});
        } else { //if valid date
            req.locals.date = validDate;
            next();
        }
    }

    /**
     * Configure the Express App
     */
    configureExpressApp() {
        this.logger.info("[MyExpressRouter] configuring Routes App");

        this.expressApp.use(this.middlewareAuthToken.bind(this)); //always check if there is a access token provided
        this.expressApp.use(bodyParser.json({limit: '50mb'})); //set body limit
        this.expressApp.use(bodyParser.urlencoded({limit: '50mb', extended: true})); //set url limit

        this.expressApp.use(fileUpload({ //set fileupload limit
            useTempFiles: true,
            tempFileDir: '/tmp/',
            limits: {fileSize: maxFileUploadSize}
        }));

        this.expressApp.param(MyExpressRouter.days_parameter, MyExpressRouter.paramcheckerDay.bind(this)); //set date param checker

        //Accept Uploads from Cross Origins - for accepting uploads of files/images
        this.expressApp.options("/*", function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
            res.send(200);
        });

        /**
         * Pulic Routes
         */
        this.expressApp.get(MyExpressRouter.custom_mealPhotoOfSchnellerTellerWesterberg, this.handleCustomWesterbergSchnellerTellerPhoto.bind(this));
        this.expressApp.post(MyExpressRouter.custom_bugReport, this.handleSendBugReport.bind(this));
        this.expressApp.get(MyExpressRouter.custom_showAllEndpoints, this.handleCustomShowAllEndpoints.bind(this));

        //for api stress test https://loader.io/
        this.expressApp.get("/loaderio-4fffcfb2d8504b146819ec8df3a58421/", this.handleVerification.bind(this));

        this.expressApp.get(MyExpressRouter.routeVersion, this.handleVersionRequest.bind(this));
        this.expressApp.get(MyExpressRouter.custom_routeSystemInformation, this.handleSystemInformationGetRequest.bind(this));
        this.expressApp.post(MyExpressRouter.custom_routeSendPushNotification, this.handleSendPushNotificationPostRequest.bind(this));
	this.expressApp.get(MyExpressRouter.custom_routeMetrics, this.handleMetricsRequest.bind(this));
    }

    /**
     * Configure all Controllers which then will register the routes and handle requests
     */
    configureController() {
        let logger = this.logger;
        let models = this.models;
        let expressApp = this.expressApp;
        let myAccessControl = this.myAccessControl;
        let instance = this;

        //Function

        this.function_BackupController = new Function_BackupController(logger, models, expressApp, myAccessControl, instance);

        // Helper
        this.defaultControllerHelper = new DefaultControllerHelper(logger, models, instance);
        this.photoHelper = new DefaultPhotoHelper(logger, models, instance);

        //Tables
        this.deviceController = new DeviceController(logger, models, expressApp, myAccessControl, instance);
        this.friendController = new FriendController(logger, models, expressApp, myAccessControl, instance);
        this.loginController = new LoginController(logger, models, expressApp, myAccessControl, instance);
        this.permissionController = new PermissionController(logger, models, expressApp, myAccessControl, instance);
        this.roleController = new RoleController(logger, models, expressApp, myAccessControl, instance);
        this.streamViewController = new StreamViewController(logger, models, expressApp, myAccessControl, instance);
        this.userController = new UserController(logger, models, expressApp, myAccessControl, instance);
        this.userroleController = new UserRoleController(logger, models, expressApp, myAccessControl, instance);
        this.feedbackController = new FeedbackController(logger, models, expressApp, myAccessControl, instance);
    }

    /**
     * Handle LoaderIO verification https://loader.io/ for stress tests
     * @param req the request object
     * @param res the response object
     */
    handleVerification(req, res) {
        res.set('Content-Type', 'text/html');
        res.status(200);
        res.send("loaderio-4fffcfb2d8504b146819ec8df3a58421");

    }

    /**
     * Middlewares
     */

    /**
     * @apiDefine SwosyAuthorization
     * @apiHeader {String="Authorization TOKEN"} authorization Authorization Token.
     */
    middlewareAuthToken(req, res, next) {
        const logger = this.logger;
        const workerID = this.workerID;

        logger.info("[" + workerID + "][MyExpressRouter] middlewareAuthToken - url: " + req.url);
        //console.log("URL: "+req.url);

        req.locals = {};
        req.locals.user_id = null; //safety remove any user_id in requests
        req.locals.current_user = {}; //create a current user, which will be the user who initiates the request
        req.locals.current_user.id = undefined; //better define it undefined
        req.locals.current_user.role = MyAccessControl.roleNameGuest; //define it as anonymous
        req.locals.localhost = false; //this is not the local host !

        let ip = req.connection.remoteAddress; //get the dam IP adress

        if (this.isThisLocalhost(req)) { //this comes from the local host, well then the user is ON the Machine, meaning he is in control of this
            req.locals.localhost = true;
            req.locals.current_user.role = MyAccessControl.roleNameAdmin; //better make him then admin
            //logger.info("[" + workerID + "][MyExpressRouter] middlewareAuthToken - detected localhost: remoteAddress: " + ip);
            next();
            return; //abort further checks
        }

        try { //lets try to find if a token is provided
            let authorization = req.headers.authorization; //get auth headers
            if (!!authorization) { //if there are headers
                const token = authorization.split(" ")[1]; //get the token Header: ACCESSTOKEN TheSuperCoolToken

                //start verification of headers
                this.tokenHelper.verifyToken(token, function (err, tokenPayload) { //verify the token
                    if (err != null) { //if there is an error
                        if (err.name === "TokenExpiredError") { //if token is Expired
                            MyExpressRouter.responseWithJSON(res, HttpStatus.UNAUTHORIZED, {error: 'TokenExpiredError'});
                            return;
                        } else { //thats an invalid token boy !
                            //logger.error("[" + workerID + "][MyExpressRouter] middlewareAuthToken - invalid token ! remoteAddress: " + ip);
                            MyExpressRouter.responseWithJSON(res, HttpStatus.UNAUTHORIZED, {error: 'TokenInvalid'});
                            return;
                        }
                    }
                    if (!!tokenPayload) { // payload was correct so we know which user this is
                        //console.log("found tokenPayload");
                        req.locals.current_user.id = tokenPayload.user_id;
                        if (tokenPayload.role === undefined) {
                            tokenPayload.role = MyAccessControl.roleNameUser; // is nothing provided, you are atleast a user
                        }
                        req.locals.current_user.role = tokenPayload.role;
                        //console.log("okay role set continue");
                        next();
                    } else { // no correct payload
                        //console.log("No correct payload");
                        next();
                    }
                });
            } else {
                //well no authoritation provided
                next();
            }
        } catch (err) { //no headers found or some wrong headers provided

            //console.log(err);
            logger.error("[" + workerID + "][MyExpressRouter] middlewareAuthToken - " + err.toString());
            next();
        }
    }

    /**
     * Checks if a request is local host
     * @param req the request object
     * @returns {boolean} true if request comes from the same machine
     */
    isThisLocalhost(req) {
	let LocalAddress= "::ffff:127.0.1.1";
	let RemoteAddress= "::ffff:127.0.0.1";
	if(req.connection.localAddress===LocalAddress && req.connection.remoteAddress===RemoteAddress){
	    return true;
	}
        let isLocal = (req.connection.localAddress === req.connection.remoteAddress);
        return isLocal;
    }

    /**
     * Middleware which will only Accept Plaintext Passwords, Tokens dont help you here !
     * @param req the reuqest object
     * @param res the response object
     * @param next the next function
     *
     * @apiDefine SwosyPasswordAuthorization
     * @apiHeader {Content-Type="application/json"} Content-Type Authorization Token.
     * @apiParam {Number} user_id User's unique ID.
     * @apiParam {String} plaintextSecret User's password as plain text.
     */
    middlewareOnlyAuthenticatedViaPlaintextSecret(req, res, next) {
        if (req.locals.localhost) { //if this is the localhost ergo admin
            next(); //continue
            return;
        }

        //Remove Token Authentication
        req.locals.current_user = {};
        req.locals.current_user.id = undefined;
        req.locals.current_user.role = MyAccessControl.roleNameGuest;

        let plaintextSecret = req.body.plaintextSecret;

        if (!!plaintextSecret) { //if a plaintext was provided
            let user_id = parseInt(req.body.user_id);
            if (!!user_id) { // if a user id is given
                this.logger.info("[" + this.workerID + "][MyExpressRouter] middlewareOnlyAuthenticatedViaPlaintextSecret - user_id: " + user_id + " censoredSecret: " + "x".repeat("plaintextSecret".length));
                this.models.User.findOne({where: {id: user_id}}).then(user => { //search for a user
                    if (!user) { //there is no user ?
                        MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {
                            error: 'user_id not found',
                            user_id: user_id
                        });
                    } else { //okay user exists
                        user.getLogin().then(login => { //search for login, which should exist
                            if (!login) { //if the login does not exist
                                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: "User does not have a Login"});
                            } else { //if the login exists
                                let correct = LoginController.correctPlaintextSecretForUser(login, plaintextSecret); //check if password is korregt
                                if (correct) { //if thats a valid password
                                    req.locals.current_user.id = user.id; //set id
                                    req.locals.current_user.role = MyAccessControl.roleNameUser; //and lowest role
                                    this.logger.info("[" + this.workerID + "][MyExpressRouter] middlewareOnlyAuthenticatedViaPlaintextSecret - user_id: " + user_id + " correct plaintext");

                                    this.models.UserRole.findOne({where: {UserId: user.id}}).then(userroleEntry => { //but mayby he has a role ?
                                        if (!!userroleEntry) { //if a userrole entry exists
                                            let roleId = userroleEntry.RoleId;
                                            this.models.Role.findOne({where: {id: roleId}}).then(role => {
                                                if (!!role) {  //and if the role exists
                                                    req.locals.current_user.role = role.name; //the the role name in it
                                                }
                                                //okay unkown role id found?
                                                this.logger.info("[" + this.workerID + "][MyExpressRouter] middlewareOnlyAuthenticatedViaPlaintextSecret - user_id: " + user_id + " as special role: " + req.locals.current_user.role);
                                                next();
                                            }).catch(err => {
                                                this.logger.error("[" + this.workerID + "][MyExpressRouter] middlewareOnlyAuthenticatedViaPlaintextSecret - " + err.toString());
                                            });
                                        } else { //no special entry for user, but still a valid user
                                            this.logger.info("[" + this.workerID + "][MyExpressRouter] middlewareOnlyAuthenticatedViaPlaintextSecret - user_id: " + user_id + " as default role: " + req.locals.current_user.role);
                                            next();
                                        }
                                    }).catch(err => {
                                        this.logger.error("[" + this.workerID + "][MyExpressRouter] middlewareOnlyAuthenticatedViaPlaintextSecret - " + err.toString());
                                        MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
                                    })
                                } else {
                                    MyExpressRouter.responseWithJSON(res, HttpStatus.UNAUTHORIZED, {error: "WrongCredentials"});
                                }
                            }
                        }).catch(err => {
                            this.logger.error("[" + this.workerID + "][MyExpressRouter] middlewareOnlyAuthenticatedViaPlaintextSecret - " + err.toString());
                            MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
                        });
                    }
                }).catch(err => {
                    this.logger.error("[" + this.workerID + "][MyExpressRouter] middlewareOnlyAuthenticatedViaPlaintextSecret - " + err.toString());
                    MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
                });
            } else { //no user id given
                MyExpressRouter.responseWithJSON(res, HttpStatus.BAD_REQUEST, {error: "user_id is missing"});
            }
        } else { //no plaintext secret given
            MyExpressRouter.responseWithJSON(res, HttpStatus.BAD_REQUEST, {error: "plaintextSecret is missing"});
        }
    }


    /**
     * Shows route metrics of the server
     * @param req the request object
     * @param res the response object
     *
     * @api {get} /api/custom/metrics Get All route Metrics
     * @apiDescription Shows alot of informations about the server
     * @apiName GetAllMetrics
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Custom
     *
     * @apiSuccess {JSON[Metrics]} Metrics All metrics for the server routes
     * @apiError (Error) {String} error The possible error that can occur. Possible Errors: INTERNAL_SERVER_ERROR, FORBIDDEN
     *
     * @apiExample Example usage:
     * curl -i http://localhost/api/custom/metrics
     */
    async handleMetricsRequest(req,res){
	console.log("handleMetricsRequest");
	let metrics = await MetricsHelper.getMetrics(req);
	MyExpressRouter.responseWithJSON(res, HttpStatus.OK, metrics);
    }

    /**
     * Custom
     */

    /**
     * @deprecated since version 1.0 Use FeedbackController itself
     * Handle when a Bug Report comes in
     * @param req the request object
     * @param res the response object
     */
    handleSendBugReport(req, res) {
        let message = req.body.bugReport; //get the bug report message
        let sanitized = escape(message); //remove any dangerous text
        sanitized = sanitized.replace(/%20/g, " "); //replace escaped spaces and readd them
        this.bugReportLogger.info(sanitized); //log into bug logger
        MyExpressRouter.responseWithJSON(res, HttpStatus.OK, {success: 'We received your message'});

        //try to put them into better FeedBackController
        try {
            req.body.message = message;
            req.body.label = "bugreport";
            this.feedbackController.handleCreate(req, res);
            return;
        } catch (e) {
            //console.log(e);
        }

    }

    /**
     * Get the Image of the todays main dish in the canteen. Since the Studentenwerk/INFOMax cant handle variable URLs, we create a "static"
     * URL. Since Photos were made in the Canteen Westerberg this URL refers to this canteen.
     * @param req the request object
     * @param res the response object
     *
     * @api {get} /api/custom/photoSchnellerTellerWesterberg Get main dish Image
     * @apiDescription Get the Image of the todays main dish in the canteen. Since the Studentenwerk/INFOMax cant handle variable URLs, we create a "static"
     * URL. Since Photos were made in the Canteen Westerberg this URL refers to this canteen.
     * @apiName GetMainDishWesterberg
     * @apiPermission Anonym
     * @apiGroup Custom
     *
     * @apiSuccess {Binary} Image Image of the main Dish.
     * @apiError (Error) {String} error The possible error that can occur. Possible Errors: NOT_FOUND, INTERNAL_SERVER_ERROR
     *
     * @apiExample Example usage:
     * curl -i http://localhost/api/custom/photoSchnellerTellerWesterberg
     */
    handleCustomWesterbergSchnellerTellerPhoto(req, res) {
        //we need to create our dynmic link ourself somehow
        let date = new Date(); //okay it now that was easy

        let canteenName = "Mensa Westerberg"; //we know the name of the canteen

        this.models.Canteen.findOne({where: {name: canteenName}}).then(canteen => { //lets search for it
            if (!canteen || !canteen.id) { //no canteen foound ?
                MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {error: MyExpressRouter.canteen_resourceName + ' not found'});
                return;
            }
            //okay canteen if found
            this.models.CanteenMeal.findAll({ //search for all offers
                include: [{
                    model: this.models.Meal,
                    include: [{
                        model: this.models.RecipeGroup
                    }],
                }],
                where: {
                    CanteenId: canteen.id, //in our canteen
                    date: date.toISOString() //and today
                }
            }).then(canteenMealOffers => { //get all offers
                if (!canteenMealOffers) { //if there are no meals ?
                    MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {error: 'No Meal CanteenMealOffer not found'});
                    return;
                }
                for (let mealOfferIndex = 0; mealOfferIndex < canteenMealOffers.length; mealOfferIndex++) { //okay search in all meals
                    let mealOffer = canteenMealOffers[mealOfferIndex]; //get the offer
                    try { //finding the "main" dish can be tricky
                        let recipeGroupName = mealOffer.Meal.RecipeGroup.name; //get recipe group name
                        if (recipeGroupName === "KM Schneller Teller" || recipeGroupName === "KM Express") { //these are typicaly "main" groups
                            let schnellerTellerMealId = mealOffer.Meal.id; //get the ID of the meal

                            //search the image path
                            this.photoHelper.findOrCreateResolutionImage(MyExpressRouter.meal_resourceName, schnellerTellerMealId, DefaultPhotoHelper.highResTag, true, true).then(pathToFile => {
                                if (!pathToFile) {  //no image yet ...
                                    var ownPath = fs.realpathSync('.');
                                    let pathEmptyFood = ownPath + '/src/data/photos/custom/FotoLeererTellerZubereitung.jpg';
                                    res.sendFile(pathEmptyFood); //send default image
                                } else { //image found, nice send it
                                    res.sendFile(pathToFile);
                                }
                            }).catch(err => {
                                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
                            });
                            return;
                        }
                    } catch (err) {
                        MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
                        return;
                    }
                }
                //Well seems there is none offered
                MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {error: 'No ExpressMenu not found'});
            }).catch(err => {
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
            });
        }).catch(err => {
            MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
        });
    }

    /**
     * Shows all possible routes which could be used
     * @param req the request object
     * @param res the response object
     *
     * @api {get} /api/custom/showAllEndpoints Get All Endpoint routes
     * @apiDescription Shows all possible routes which could be used
     * @apiName GetAllEndpoints
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Custom
     *
     * @apiSuccess {List[Routes]} Routes All possible routes
     * @apiError (Error) {String} error The possible error that can occur. Possible Errors: INTERNAL_SERVER_ERROR, FORBIDDEN
     *
     * @apiExample Example usage:
     * curl -i http://localhost/api/custom/showAllEndpoints
     */
    handleCustomShowAllEndpoints(req, res) {
        let permission = this.myAccessControl
        .can(req.locals.current_user.role)
        .readAny(MyExpressRouter.adminRoutes_accessControlResource);

        if (permission.granted) {
            try {
                console.log("handleShowAllEndpoints");
                let expressApp = this.expressApp;
                let endpoints = expressApp.router.stack;
                let answer = endpoints;
                MyExpressRouter.responseWithJSON(res, HttpStatus.OK, answer);
            } catch (err) {
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {error: err.toString()});
            }
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error:
                    "Forbidden to see all endpoints: "
            });
        }
    }

    /**
     * Other
     */

    /**
     * !! This Route will Never Change !! Get the actual Server API Version number.
     * @param req the request object
     * @param res the response object
     *
     * @api {get} /api/version Get the API version
     * @apiDescription !! This Route will Never Change !! Get the actual Server API Version number
     * @apiName GetAPIVersion
     * @apiPermission Anonym
     * @apiGroup 4Custom
     *
     * @apiSuccess {String} version The actual version of the Server API.
     *
     * @apiExample Example usage:
     * curl -i http://localhost/api/version
     */
    handleVersionRequest(req, res) {
        let answer = {version: MyExpressRouter.serverAPIVersion};
        //answer = jsonTest;
        MyExpressRouter.responseWithJSON(res, HttpStatus.OK, answer);

    }

    /**
     * Handle System Information Request, which provide all machine based informations
     * @param req the request object
     * @param res the response object
     *
     * @api {get} /api/custom/systemInformation Get All System Informations
     * @apiDescription Handle System Information Request, which provide all machine based informations
     * @apiName GetAllSystemInformations
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Custom
     *
     * @apiSuccess {List[Routes]} Routes All possible routes
     * @apiError (Error) {String} error The possible error that can occur. Possible Errors: FORBIDDEN
     *
     * @apiExample Example usage:
     * curl -i http://localhost/api/custom/systemInformation
     */
    handleSystemInformationGetRequest(req, res) {
        this.logger.info("System Information Request");

        let permission = this.myAccessControl
        .can(req.locals.current_user.role)
        .readAny(MyExpressRouter.adminRoutes_accessControlResource);

        if (permission.granted) { //can read system informations
            MyExpressRouter.redisClient.get(SystemInformationHelper.redisKey, (err, cachedStringData) => {
                let answer = JSON.parse(cachedStringData);
                MyExpressRouter.responseWithJSON(res, HttpStatus.OK, answer);
            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to get System Informations'
            });
        }
    }

    /**
     * Sends Push Notifications to the given Devices
     * @param req the request object
     * @param res the response object
     *
     * @api {get} /api/custom/sendNotification Get All System Informations
     * @apiDescription Sends Push Notifications to the given Devices
     * @apiName GetSendPushNotification
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Custom
     *
     * @apiParam (Request message body) {String} title The title for the push notification
     * @apiParam (Request message body) {String} body The body text for the push notification
     * @apiParam (Request message body) {String} badge for iOS Devices the App Notifier number
     * @apiParam (Request message body) {List[String]} listOfDeviceIDs The list of recipients
     *
     * @apiSuccess {List[Routes]} Routes All possible routes
     * @apiError (Error) {String} error The possible error that can occur. Possible Errors: INTERNAL_SERVER_ERROR, FORBIDDEN
     */
    handleSendPushNotificationPostRequest(req, res) {

        let permission = this.myAccessControl
        .can(req.locals.current_user.role)
        .createAny(MyExpressRouter.adminRoutes_accessControlResource);

        if (permission.granted) { //can create a push notification
            this.logger.info("Received a Post Request to send a Message to Devices");
            //get all params
            let title = req.body.title;
            let body = req.body.body;
            let badge = req.body.badge;
            let listOfDeviceIDs = req.body.listOfDeviceIDs;

            this.firebaseAPI.sendPushNotification(listOfDeviceIDs, title, body, badge).then((answer) => { //call firebase helper
                this.logger.info("Sending: " + listOfDeviceIDs.length + " tokens");
                MyExpressRouter.responseWithJSON(res, HttpStatus.OK, answer); //answer to client
            }).catch(err => {
                // an error occurred, call the done function and pass the err message
                this.logger.error("Send Notification created an error");
                this.logger.error(err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, answer);
            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to get System Informations'
            });
        }
    }

}
