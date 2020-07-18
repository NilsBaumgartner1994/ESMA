/* eslint no-console: "off" */

import ScheduleModule from "./module/ScheduleModule";

/**
 * ServerAPI Starts here
 * All needed modules will be loaded here
 * configurations will be set
 * and the server will be started
 */

const config = require("./../config/config.json")["server"];

const fs = require("fs"); //file-system
const ownPath = fs.realpathSync('.');

const certs = {
    "swosy.sw-os.de": {
        key: ownPath + "/certificates/swosy-privkey.pem",
	    cert: ownPath + "/certificates/swosy-combined.pem"
    }
};

/***********************************************************************************************************************
 *********************************************** Import of Libraries ***************************************************
 **********************************************************************************************************************/

//External Libraries
import path from "path";
import Express from "express"; //express as server
import MyAccessControl from "./module/MyAccessControl"; //Database handler
import MyExpressRouter from "./module/MyExpressRouter"; //Routing Module
import FirebaseAPI from "./module/FirebaseAPI"; //Push Notifications sending
import MyLogger from "./module/MyLogger"; //Logger Module
import FancyTerminal from "./helper/FancyTerminal"; //backup for Database

const os = require("os");
const https = require("https");
const { constants } = require('crypto');
const http = require("http"); //if the server cant start as http
const helmet = require("helmet"); //Security
const tls = require("tls");
const cluster = require("cluster"); //distibuting this server on all cores of the server
var numCPUs = os.cpus().length;
numCPUs = 1;
const redis = require("redis"); //for caching
const cors = require("cors"); // for cross origin allow support

const promBundle = require("express-prom-bundle"); // prometheus for express easy integration

const models = require("./../models"); // Sequelize The ORM (Database Models)

const RedisServer = require("redis-server"); //redis server for caching requests
const redisPort = config.redisPort;

var myServerAPILogger,
    serverAPILogger,
    myBugReportLogger,
    bugReportLogger,
    myEnvironmentLogger,
    environmentLogger,
    mySystemLogger,
    systemLogger,
    expressApp,
    firebaseAPI,
    myAccessControl,
    myExpressRouter,
    scheduleModule,
    redisClient;

const motd =
    "\n" +
    "███████╗███████╗███╗   ███╗ █████╗ \n" +
    "██╔════╝██╔════╝████╗ ████║██╔══██╗\n" +
    "█████╗  ███████╗██╔████╔██║███████║\n" +
    "██╔══╝  ╚════██║██║╚██╔╝██║██╔══██║\n" +
    "███████╗███████║██║ ╚═╝ ██║██║  ██║\n" +
    "╚══════╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝\n" +
    "\n";

main();

/***********************************************************************************************************************
 *********************************************** Clustering ************************************************************
 **********************************************************************************************************************/

/**
 * Adds Logging output
 * @param workerID the worker ID or name
 * @param message The message
 * @returns {Promise<void>}
 */
async function addWorkerOutput(workerID, message) {
    if (cluster.isWorker) {
        process.send({workerID: cluster.worker.id, message: message});
        return;
    }
    if (!workerID) { // then this is master
        workerID = "Master";
    }

    FancyTerminal.addWorkerOutput(workerID, message);
}

/**
 * The Main Function of the server
 * @returns {Promise<void>}
 */
async function main() {
    if (cluster.isMaster) { //if thats the master
        console.log("Welcome to");
        console.log(motd);
        FancyTerminal.startFancyTerminal(); //start fancy terminal

        await startRedisServer(); //start the redis server
        addWorkerOutput(null, "Models synchronizing ...");
        models.sequelize
        .sync()
        .then(async function () { //model sync finished
            addWorkerOutput(null, "Models synchronized");
            createCluster();
        })
        .catch(function (error) { //models cant be synced
            addWorkerOutput(null, "Error at Model Sync");
            console.log(error.toString());
        });
    } else { //this is not the master then we dont need to reconfigure everything
        prepareWorkerServer();
    }
}

/**
 * Start the Redis Server which caches often request answers
 * @returns {Promise<void>}
 */
async function startRedisServer() {
    if(!config.redisAlreadyRunning){
        const server = new RedisServer(redisPort);
        await server.open(err => { //start server
            if (err === null) {
                // You may now connect a client to the Redis
                // server bound to port 6379.
            } else {
                addWorkerOutput(null, "Error at starting Redis Server: " + err);
            }
        });
    }
}

/**
 * Configure a Cluster Worker
 * @param cp cluster worker
 * @returns {Promise<void>}
 */
async function configureFork(cp) {
    cp.on("exit", (code, signal) => {
        addWorkerOutput(null, "Some worker died :-(, let's revive him !");
        let revived = cluster.fork();
        configureFork(revived);
    });
    cp.on("message", msg => { //if cluster sends message to master
        const workerID = msg.workerID;
        const message = msg.message;
        addWorkerOutput(workerID, message); //master will add the output
    });
}

/**
 * Create Cluster with multiple workers
 * @returns {Promise<void>}
 */
async function createCluster() {
    if (cluster.isMaster) {
        addWorkerOutput(null, "Cluster Master starting");

        // Fork workers.
        let cp = null;
        for (let i = 0; i < numCPUs; i++) { //every core should become a worker
            addWorkerOutput(null, "Cluster create Worker: " + i);
            cp = cluster.fork();
            configureFork(cp); //configure it
        }
        prepareMasterServer(); //after that is finished set ourself up
    }
}

/**
 * Prepare the Master Server. The Master Server wont response any requests which are meant for the users, maybe admins
 * @returns {Promise<void>}
 */
async function prepareMasterServer() {
    let workerID = "Master";
    addWorkerOutput(workerID, "prepareMasterServer");
    prepareSharedLoggerAndModules(workerID);
    createMasterLoggers(workerID); //keep this order
    scheduleModule = new ScheduleModule(serverAPILogger,models,firebaseAPI,redisClient);
    createMasterExpressApp();
    startWorkerServer(config.metricsPort); //we will listen on 9999 and we are a "worker"
}

/**
 * Prepare shared Loggers and modules
 * @param workerID
 */
function prepareSharedLoggerAndModules(workerID) {
    createSharedLoggers(workerID);
    createSharedModules();
}

/**
 * Prepare a worker server
 * @returns {Promise<void>}
 */
async function prepareWorkerServer() {
    let workerID = "Master";
    if (cluster.isWorker) { //if we are a fork, get our id
        workerID = cluster.worker.id;
    }
    addWorkerOutput(workerID, "prepare Server");
    prepareSharedLoggerAndModules(workerID);
    createWorkerLoggers(workerID); //keep this order
    createWorkerExpressApp(workerID);
    createWorkerModules(workerID);
    startWorkerServer();
}

/***********************************************************************************************************************
 *********************************************** Create Loggers ********************************************************
 **********************************************************************************************************************/

/**
 * Create API Logger which everyone will use
 * @param workerID the worker id
 */
function createSharedLoggers(workerID) {
    addWorkerOutput(workerID, "createSharedLoggers");
    myServerAPILogger = new MyLogger("ServerAPI", workerID);
    serverAPILogger = myServerAPILogger.getLogger();
}

/**
 * Create the loggers specially for the forks/workers
 * @param workerID the worker id
 */
function createWorkerLoggers(workerID) {
    addWorkerOutput(workerID, "Creating Loggers");

    myBugReportLogger = new MyLogger("BugReport", workerID);
    bugReportLogger = myBugReportLogger.getLogger();
}

/**
 * Create the loggers which only the master will need
 * @param workerID
 */
function createMasterLoggers(workerID) {
    addWorkerOutput(workerID, "Creating Master Loggers");

    myEnvironmentLogger = new MyLogger("Environment", workerID);
    environmentLogger = myEnvironmentLogger.getLogger();

    mySystemLogger = new MyLogger("System", workerID);
    systemLogger = mySystemLogger.getLogger();
}

/***********************************************************************************************************************
 *********************************************** Create Express App with configurations ********************************
 **********************************************************************************************************************/

/**
 * Create an Express App for the master
 */
function createMasterExpressApp() {
    addWorkerOutput("Master", "Creating Master Express App");
    expressApp = new Express();
    expressApp.use(cors()); //we allow cross origin
    expressApp.use(cors({credentials: true, origin: true}));
    expressApp.use("/metrics/metrics", promBundle.clusterMetrics()); //start metrics for the clusters
    //expressApp.listen(9999)
}

/**
 * Create an Express App for the workers
 * @param workerID
 */
function createWorkerExpressApp(workerID) {
    addWorkerOutput(workerID, "Creating ExpressApp");
    expressApp = new Express();
    expressApp.use(cors()); // we allow cross orign

    expressApp.use(
        promBundle({
            autoregister: false, // disable /metrics for single workers
            includePath: true,
            metricType: "histogram",
            includeMethod: true,
            buckets: [0.1, 1, 5],
            normalizePath: [
                [/\d[\-\d]*/g, "#val"] //replace id's like 2345-323-234 to #val
            ],
            promClient: {
                collectDefaultMetrics: {
                    timeout: 1000
                }
            }
        })
    );

    expressApp.use(helmet()); //use security
    expressApp.disable("x-powered-by"); //Attackers can use this header to detect apps running Express and then launch specifically-targeted attacks.

    // use ejs templates
    expressApp.set("view engine", "ejs");
    expressApp.set("views", path.join(__dirname, "views"));

    expressApp.use(Express.json());
    expressApp.use(cors({credentials: true, origin: true}));

    // define the folder that will be used for static assets
    expressApp.use(Express.static(path.join(__dirname, "static")));
}

/***********************************************************************************************************************
 *********************************************** Create Modules ********************************************************
 **********************************************************************************************************************/

/**
 * Create Modules everyone will need
 */
function createSharedModules() {
    firebaseAPI = new FirebaseAPI(serverAPILogger, models);
    createRedisClient();
}

/**
 * Create a Redis Client
 */
function createRedisClient() {
    redisClient = redis.createClient(redisPort);
    redisClient.on("error", err => {
        addWorkerOutput(null, err);
    });
}

/**
 * Create worker Modules
 * @param workerID the worker ID
 */
function createWorkerModules(workerID) {
    addWorkerOutput(workerID, "creating Modules");
    myAccessControl = new MyAccessControl(serverAPILogger, models);
    myExpressRouter = new MyExpressRouter(
        workerID,
        serverAPILogger,
        bugReportLogger,
        firebaseAPI,
        expressApp,
        models,
        myAccessControl.getAccessControlInstance(),
        redisClient
    );
}

/***********************************************************************************************************************
 *********************************************** Start the Server ******************************************************
 **********************************************************************************************************************/

/**
 * Read the Certificate for SSH
 * @param certs
 */
function getSecureContexts(certs) {
    if (!certs || Object.keys(certs).length === 0) {
        throw new Error("Any certificate wasn't found.");
    }

    const certsToReturn = {};

    for (const serverName of Object.keys(certs)) { //get all server names the cert is valid
        const appCert = certs[serverName];

        certsToReturn[serverName] = tls.createSecureContext({ //create secure context
            key: fs.readFileSync(appCert.key), //the key
            cert: fs.readFileSync(appCert.cert), // the certificate itself
            // If the 'ca' option is not given, then node.js will use the default
            ca: appCert.ca ? sslCADecode(fs.readFileSync(appCert.ca, "utf8")) : null
        });
    }

    return certsToReturn;
}

/**
 * Decodes an SSL Certificate
 * if CA contains more certificates it will be parsed to array
 * @param source the source file of the certificate
 * @returns {Array}
 */
function sslCADecode(source) {
    if (!source || typeof source !== "string") {
        return [];
    }

    let splits = source.split(
        /-----END CERTIFICATE-----[\s\n]+-----BEGIN CERTIFICATE-----/
    );
    splits.map((value, index) => {
        if (index) {
            value = "-----BEGIN CERTIFICATE-----" + value;
        }
        if (index !== splits.length - 1) {
            value = value + "-----END CERTIFICATE-----";
        }
        value = value.replace(/^\n+/, "").replace(/\n+$/, "");
        return value;
    });
}

/**
 * Start a Server for the worker
 * @param customPort if a specific port if wanted, this can be used
 */
function startWorkerServer(customPort) {
    let workerID = "Master";
    if (cluster.isWorker) {
        workerID = cluster.worker.id;
    }
    addWorkerOutput(workerID, "Starting Server ...");
    let port = config.port;
    if (!!customPort) {
        port = customPort;
    }

    if (cluster.isMaster) {
        addWorkerOutput("Master", "Master Server ready on port: " + port);
    }

    const env = process.env.NODE_ENV || "production"; //get the enviroment

    var ownPath = fs.realpathSync(".");

    try {
        const secureContexts = getSecureContexts(certs); //get secure context

        const options = {
	    secureOptions: constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1,
            // A function that will be called if the client supports SNI TLS extension.
            SNICallback: (servername, cb) => {
                const ctx = secureContexts[servername];

                /**
                 if (!ctx) {
	            console.log(`Not found SSL certificate for host: ${servername}`);
	        } else {
	            console.log(`SSL certificate has been found and assigned to ${servername}`);
	        }
                 */

                if (cb) {
                    cb(null, ctx);
                } else {
                    return ctx;
                }
            }
        };

        https.createServer(options, expressApp).listen(port, err => { //start the server itself
            if (err) {
                return console.error(err);
            }
            let workerID = "Master";
            if (!cluster.isMaster) {
                workerID = cluster.worker.id;
            }

            addWorkerOutput(workerID, `Server running on https://localhost:${port} [${env}]}`);
        });
    } catch (e) { //if HTTPS is not possible
        addWorkerOutput(workerID, "No certificates for https found");
        http.createServer(expressApp).listen(port, err => { //well start http instead
            if (err) {
                return console.error(err);
            }
            addWorkerOutput(workerID, `Server running on http://localhost:${port} [${env}]}`);

        });
    }
}
