import DateHelper from "./DateHelper";

const jwt = require('jsonwebtoken');
const jwtSecret = "supersecretJWTKey";
const default_token_expirationTime = "1h";

/**
 * A Token helper for easy verification and creating of tokens
 */
export default class MyTokenHelper {

    /**
     * Constructor for the token Helper
     * @param logger the logger class
     */
    constructor(logger) {
        this.logger = logger;
        this.logger.info("[MyTokenHelper] creating");
    }

    /**
     * Verifies a Token and calls a callback function on result
     * @param token the token to be checked
     * @param functionToCall the callback function
     */
    verifyToken(token, functionToCall) {
        jwt.verify(token, jwtSecret, functionToCall);
    }

    /**
     * Creates a Token with an default expiration time
     * @param user_id The UserID we want to add into the key
     * @param roleName the RoleName we want to add
     * @returns {string} the token
     */
    createToken(user_id, roleName) {
        this.logger.info("[MyTokenHelper] createToken: user_id: " + user_id + " role: " + roleName);
        let token = jwt.sign({user_id: user_id, role: roleName}, jwtSecret, {expiresIn: default_token_expirationTime});
        return token;
    }

}
