import * as firebase from 'firebase-admin';

const fs = require("fs");
import path from "path";

const ownPath = fs.realpathSync('.');
const pathToFirebasePrivateKey = path.resolve(ownPath,"certificates","firebasePrivateKey.json");
const serviceAccount = require("/home/ESMA/API/certificates/firebasePrivateKey.json");
//const serviceAccount = require(pathToFirebasePrivateKey);

/** SUBSCRIBING TO TOPICS needs to be implemented
 https://firebase.google.com/docs/cloud-messaging/manage-topics
 */

/**
 * FireBase API is used to send messages via Push-Notifications to the users
 */
export default class FirebaseAPI {

    /**
     * Constructor with initializing the the firebase private key
     * @param logger The logger
     * @param models The models of the sequelize database
     */
    constructor(logger, models) {
        this.logger = logger;
        this.logger.info("[FirebaseAPI] initialising");
        this.models = models;

        this.logger.info("[FirebaseAPI] Load Private Key");
        try {
            this.firebasePrivateKey = this.loadFireBasePrivateKey(); //load private key
            firebase.initializeApp({
		  credential: firebase.credential.cert(serviceAccount),
		  databaseURL: "https://swosy-284f0.firebaseio.com"
            });
        } catch (err) {
            this.logger.error("[FirebaseAPI] coulnt find the private key!");
        }
        this.logger.info("[FirebaseAPI] initialised");
    }

    /**
     * Load the Priate key for firebase
     * @returns {any}
     */
    loadFireBasePrivateKey() {
        this.logger.info("Loading Firebase Private Key File");
        let rawContent = fs.readFileSync(pathToFirebasePrivateKey, 'utf8', function (err, data) {
            if (err) throw err; // we'll not consider error handling for now
        });
        this.logger.info("Parsing Firebase Private Key");
        const firebasePrivateKey = JSON.parse(rawContent);
        return firebasePrivateKey;
    }

    /**
     * Filter list of Device IDs to get only valid Device Tokens
     * @param listOfPushTokens
     * @returns {Array}
     */
    assertListOfDeviceIDsIsValidType(listOfPushTokens) {
        let copy = []; //create a copy
        for (let x = 0; x < listOfPushTokens.length; x++) { //iterate over all push tokens
            let pushToken = listOfPushTokens[x];
            if ((typeof pushToken === 'string' || pushToken instanceof String) && pushToken.length > 0) { //not that good function
                //okay now we have a string which is not empty
                copy.push(pushToken);
            }
        }
        return copy;
    }

    /**
     * Send a Push Notification to a List of Push Tokens
     * @param listOfPushNotificationTokens The list of Push-Tokens
     * @param title The title
     * @param body The body Message
     * @param badge iOS only the Badge, a litle number showing the amount of messages
     * @returns {Promise<any>}
     */
    sendPushNotification(listOfPushNotificationTokens, title, body, badge) {
        listOfPushNotificationTokens = this.assertListOfDeviceIDsIsValidType(listOfPushNotificationTokens); //filter push tokens

        // create promise with resolve and reject as params
        return new Promise((resolve, reject) => {
            this.logger.info("[FirebaseAPI] Sending Push-Notification-Message to: " + listOfPushNotificationTokens.length + " devices");

            let i, j, chunk = 100; //firebase only allows to send messages in chunks, of arount 100
            let chunkDeviceLists = []; //so we create a list of chunks
            let chunkNumber = 0;
            //TODO make this a own function
            for (i = 0, j = listOfPushNotificationTokens.length; i < j; i += chunk) { //and split the tokens into chunks
                let temparray = listOfPushNotificationTokens.slice(i, i + chunk);
                chunkDeviceLists[chunkNumber] = temparray;
                chunkNumber++;
            }
            this.logger.info("[FirebaseAPI] Splitting Push-Notification into " + chunkNumber + " message packages");

            let chunkPromises = []; //create a list of promises, each for a chunk
            for (i = 0, j = chunkDeviceLists.length; i < j; i++) { //for a chunks of tokens
                let PushNotificationPayload = this.createPushNotificationPayload(chunkDeviceLists[i], title, body, badge); //create payload
                chunkPromises[i] = this.createPromiseForSendingPushNotifications(PushNotificationPayload, chunkDeviceLists[i]); //create promise
            }
            this.logger.info("[FirebaseAPI] Created all Promises, now resolving them all");
	    console.log("chunkPromises.length: "+chunkPromises.length);

            Promise.all(chunkPromises) //resolve all promises at once
            .then(values => { //get all results
                this.logger.info("Okay done?: " + values.length);
                this.logger.info("Values: " + values.toString());
                let collectedFailedTokens = []; //list of failed tokens
                for (i = 0; i < values.length; i++) { //for all results
                    this.logger.info("Okay now here should be a list of tokens: " + values[i].toString());
                    collectedFailedTokens = collectedFailedTokens.concat(values[i]); //get the failed tokens and add them
                }
                this.logger.info("collectedFailedTokens: " + collectedFailedTokens.toString());
                let answer = {
                    'deviceTokensAmount': listOfPushNotificationTokens.length,
                    'failedTokens': collectedFailedTokens
                };
                resolve(answer); //resolve promise
            });
        });
    }

    /**
     * Create a Push Notification Payload
     * For more Information https://firebase.google.com/docs/cloud-messaging/send-message#send_to_individual_devices
     * @param listOfPushNotificationTokens The list of Push Notification tokens
     * @param PushTitle The title
     * @param PushBody The real message in the body
     * @param PushBadge iOS only Badge, a small number next to the app
     * @returns {{notification: {title: string, body: string}, android: {notification: {color: string, icon: string}, ttl: number}, apns: {payload: {aps: {badge: number}}}, tokens: *}}
     */
    createPushNotificationPayload(listOfPushNotificationTokens, PushTitle = "Swosy", PushBody = "was gibt es heute leckeres?", PushBadge = 0) {
        let message = {
            notification: {
                title: PushTitle,
                body: PushBody,
            },
/**
            android: {
                ttl: 3600 * 1000,
                notification: {
		    icon: 'ic_launcher_notification',
                    color: '#ffe339',
                },
            },
            apns: {
                payload: {
                    aps: {
                        badge: PushBadge,
                    },
                },
            },
*/
            tokens: listOfPushNotificationTokens,
            //topic: 'industry-tech'
        };
        return message;
    }

    /**
     * Create a Promise for Sending a Push Notification
     * @param PushNotificationPayload The payload of the message
     * @param listOfPushNotificationTokens The list of Push Notification tokens
     * @returns {Promise<any>}
     */
    createPromiseForSendingPushNotifications(PushNotificationPayload, listOfPushNotificationTokens) {
        return new Promise((resolve, reject) => {
	    console.log("createPromiseForSendingPushNotifications: ");
	    console.log("firebase exists: "+!!firebase);
	    console.log("PushNotificationPayload: "+!!PushNotificationPayload);
	    console.log(JSON.stringify(PushNotificationPayload));
	    console.log("listOfPushNotificationTokens");
	    console.log(JSON.stringify(listOfPushNotificationTokens));
            firebase.messaging().sendMulticast(PushNotificationPayload) //send to all tokens in the payload
            .then((response) => { //the response
		console.log("got a response of sending: "+!!response);
		console.log(JSON.stringify(response));
                const failedTokens = []; //list for failed tokens
                if (response.failureCount > 0) { //if there are failed tokens
                    response.responses.forEach((resp, idx) => { //for each fail entry
                        if (!resp.success) { //if the response was not successfull
                            failedTokens.push(listOfPushNotificationTokens[idx]); //add to failed list
                            this.logger.info("Ups " + idx + " didnt went well cause:");
                            let errorCode = resp.error.errorInfo.code; //get error code
                            let errorMessage = resp.error.errorInfo.message; //get error message
                            this.handleSendError(listOfPushNotificationTokens[idx], resp, errorCode, errorMessage); //handle the error with REMOVING the Push Token
                        }
                    });
                }
                this.logger.info("[FirebaseAPI] Failed to send to: " + failedTokens.length + " Devices");
                this.logger.info("[FirebaseAPI] Sended Successfully to " + (listOfPushNotificationTokens.length - failedTokens.length) + "/" + listOfPushNotificationTokens.length + " Devices");
                resolve(failedTokens); //finish promise
            }).catch(e => {
		console.log("got an error sending");
		console.log(e);
		reject(e);
	    });
        });
    }

    /**
     * Handle a Failed Push Notification token by REMOVING it from the Database
     * @param pushNotificationToken The push notification token
     * @param resp the response of the failed request
     * @param errorCode the error code
     * @param errorMessage the error message
     */
    handleSendError(pushNotificationToken, resp, errorCode, errorMessage) {
        //https://firebase.google.com/docs/cloud-messaging/send-message#admin_sdk_error_reference
        this.logger.info("Error For Delivering a Message");
        this.logger.info("deviceToken: " + pushNotificationToken);
        this.logger.info("errorCode: " + errorCode);
        this.logger.info("errorMessage: " + errorMessage);

        if (errorCode == "messaging/invalid-argument" || //if illegal argurment
            errorCode == "messaging/invalid-recipient" || //or we are not allowed to send to this person
            errorCode == "messaging/invalid-registration-token" || //or the token is invalid
            errorCode == "messaging/registration-token-not-registered") { //or the token is unkown
            this.models.Device.findAll({where: {pushNotificationToken: pushNotificationToken}}).then(devices => { //find ALL Device with this invalid token
                for (let i = 0; i < devices.length; i++) { // for every device
                    let device = devices[i];
                    device.pushNotificationToken = null; //remove the token
                    device.save(); //and save it
                }
            });
        }
    }


}
