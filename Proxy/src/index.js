/* eslint no-console: "off" */
/**
 * Proxy Starts here
 * All needed modules will be loaded here
 * configurations will be set
 * and the server will be started
 */

const config = require("./../config/config.json");

import path from "path";
import Express from "express";
import MyLogger from "./module/MyLogger"; // Using Winston
const basicAuth = require("express-basic-auth");

const { constants } = require('crypto')
const https = require("https");
const http = require("http");
const cors = require("cors"); // to allow cors

const helmet = require("helmet"); // Security
const fs = require("fs");
const proxy = require("express-http-proxy");

/***********************************************************************************************************************
 *********************************************** Import of Libraries ***************************************************
 **********************************************************************************************************************/

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

function getUnauthorizedResponse(req) {
    return req.auth
        ? `Credentials ${req.auth.user}:${req.auth.password} rejected`
        : "No credentials provided";
}

function myAuthorizer(username, password) {
    const userMatches = basicAuth.safeCompare(username, config.auth.username);
    const passwordMatches = basicAuth.safeCompare(password, config.auth.password);

    return userMatches & passwordMatches;
}

/**
 * The Main Function of the server
 * @returns {Promise<void>}
 */
async function main() {
    console.log("Welcome to");
    console.log(motd);

    const backend = config.server.api_server_domain; // At Production Server

    const url = require("url");

// Problem Error: unable to verify the first certificate
//solution https://stackoverflow.com/questions/31673587/error-unable-to-verify-the-first-certificate-in-nodejs
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0; //TODO find an other solution for this.
//this is only okay if we are dealing with localhost

// https://github.com/villadora/express-http-proxy/issues/127
    const isMultipartRequest = req => {
        const contentTypeHeader = req.headers["content-type"];
        return contentTypeHeader && contentTypeHeader.indexOf("multipart") > -1;
    };

    const ownPath = fs.realpathSync(".");

    const proxyMiddleware = (req, res, next) =>
        proxy(backend, {
            parseReqBody: !isMultipartRequest(req),
            proxyReqPathResolver: req =>
                url.parse(req.baseUrl).path + url.parse(req.url).path
        })(req, res, next);

    const apiProxy = proxyMiddleware;

    const metrics = config.server.server_api_metrics;
    const apiMetrics = (req, res, next) =>
        proxy(metrics, {
            parseReqBody: !isMultipartRequest(req),
            proxyReqPathResolver: req =>
                url.parse(req.baseUrl).path + url.parse(req.url).path
        })(req, res, next);


    const frontend = config.server.server_frontend_domain; // For Localhsot, but seems to be ok with Production Server
    const apiFrontend = proxy(frontend, {
        proxyReqPathResolver: req => url.parse(req.baseUrl).path
    });

    const testend = config.server.server_test_domain;
    const apiTestend = proxy(testend, {
        proxyReqPathResolver: req => url.parse(req.baseUrl).path
    });

    const myLogger = new MyLogger();
    const logger = myLogger.getLogger();

// END OF THE LOGGER
    logger.info("Logger Instance (winston) created");

    const app = new Express();
    app.use(cors()); // has to be the first
    app.use(helmet()); // use security
    app.disable("x-powered-by"); // Attackers can use this header to detect apps running Express and then launch specifically-targeted attacks.

    app.use(Express.json());

    app.use(
        basicAuth({
            authorizer: myAuthorizer,
            unauthorizedResponse: getUnauthorizedResponse,
            challenge: true,
            realm: "swosy.sw-os"
        })
    );


// define the folder that will be used for static assets
    app.use(Express.static(path.join(__dirname, "static")));

    app.use("/api/*", apiProxy); // this will proxy all incoming requests to /api route to back end
    app.use("/metrics/*", apiMetrics);
//app.use("/*", apiTestend);
    app.use("/*", apiFrontend); // this will proxy all incoming requests to /client route to front end

// start the server
    const env = "production"; // process.env.NODE_ENV ||

    try {
        const port = 443; //https
        const httpsCredntials = {
            secureOptions: constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1,
            key: fs.readFileSync(path.join(__dirname, "../../ServerAPI/certificates/privkey.pem")),
            cert: fs.readFileSync(
                path.join(__dirname, "../../ServerAPI/certificates/cert.pem")
            ),
            passphrase: "YOUR PASSPHRASE HERE"
        };
        https.createServer(httpsCredntials, app).listen(port, err => {
            if (err) {
                return console.error(err);
            }
            return console.info(
                `
      Server running on https://localhost:${port} [${env}]
      Universal rendering: ${process.env.UNIVERSAL ? "enabled" : "disabled"}
    `
            );
        });
    } catch (e) {
        const port = 80; //http
        console.log("No certificates for https found");
        http.createServer(app).listen(port, err => {
            if (err) {
                return console.error(err);
            }
            return console.info(
                `
        Server running on http://localhost:${port} [${env}]
        Universal rendering: ${process.env.UNIVERSAL ? "enabled" : "disabled"}
    `
            );
        });
    }

}