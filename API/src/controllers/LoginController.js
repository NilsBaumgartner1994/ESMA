import CryptoHelper from "../helper/CryptoHelper";
import MyExpressRouter from "../module/MyExpressRouter";

export default class LoginController {


    constructor(logger, models, expressApp, myAccessControl, myExpressRouter) {
        this.logger = logger;
        this.models = models;
        this.expressApp = expressApp;
        this.myAccessControl = myAccessControl;
        this.myExpressRouter = myExpressRouter;
        this.prepareRoutes();
        this.configureRoutes();
        this.logger.info("[" + this.myExpressRouter.workerID + "][LoginController] initialised");
    }

    /**
     * Safe compare for Plaintext Secret with hashed Secret key. Timing attacks are difficult on this. Tries to take same time
     * @param loginInstance
     * @param plaintextSecret
     * @returns {boolean}
     */
    static correctPlaintextSecretForUser(loginInstance, plaintextSecret) {
        let hashedSecretKey = loginInstance.hashedSecretKey;
        let correct = CryptoHelper.compare(plaintextSecret, hashedSecretKey);
        return correct;
    }

    prepareRoutes() {
        this.resource_id_parameter = MyExpressRouter.login_resource_id_parameter;
        this.routeResources = MyExpressRouter.login_routeResources;
        this.routeResource = MyExpressRouter.login_routeResource;
        this.accessControlResource = MyExpressRouter.login_accessControlResource;
        this.resourceName = MyExpressRouter.login_resourceName;
    }

    configureRoutes() {

    }

}
