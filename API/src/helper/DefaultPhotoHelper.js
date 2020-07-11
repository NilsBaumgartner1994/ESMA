import HttpStatus from "http-status-codes";
import MyExpressRouter from "../module/MyExpressRouter";
import FileSystemHelper from "./FileSystemHelper";
import path from "path";

const fs = require("fs"); //file-system
//const Jimp = require('jimp'); // JavaScript Image Manipulation Program - https://www.npmjs.com/package/jimp
var sharp = require('sharp'); //use sharp its better than jimp - https://sharp.pixelplumbing.com/performance
var smartcrop = require('smartcrop-sharp'); //smartcrop to crop images automatically

const developerAllowWithoutPermission = false; //better stay this turnes of

/**
 * Default Photo Helper for Resources. Crop and Saves images to disk.
 */
export default class DefaultPhotoHelper {

    /**
     * Resolutions
     */
    static originalResTag = "original";
    static thumbnailResTag = "thumbnail";
    static lowResTag = "low";
    static mediumResTag = "medium";
    static highResTag = "high";
    static resolutions = {
        [this.thumbnailResTag]: 128,
        [this.lowResTag]: 512,
        [this.mediumResTag]: 1024,
        [this.highResTag]: 2048,
        [this.originalResTag]: null
    };
    static defaultResTag = this.mediumResTag; //default resolution

    /**
     * Constructor of the default photo helper
     * @param logger the logger which should be used
     * @param models the models from sequelize
     * @param myExpressRouter the express router
     */
    constructor(logger, models, myExpressRouter) {
        this.logger = logger;
        this.models = models;
        this.myExpressRouter = myExpressRouter;
    }

    /**
     * Get the Path to the file without file extension
     * @param resourceName The resource name / folder name
     * @param resourceId the id of the photo
     * @returns {*}
     */
    getPhotoFolderPath(resourceName, resourceId) {
        var ownPath = fs.realpathSync('.');
        let folderPath = path.join(ownPath, 'src', 'data', 'photos', "" + resourceName, "" + resourceId);
        return folderPath;
    }

    /**
     * Get the Path to the file with the resolution and modifiers
     * @param resourceName The resource name / folder name
     * @param resourceId The id of the resource
     * @param resTag the resolution tag
     * @param useSmartCrop Boolean if smart crop was used
     * @param useWebp Boolean if webp was used
     * @returns {*}
     */
    getFilePathForResolutionImage(resourceName, resourceId, resTag, useSmartCrop, useWebp = true) {
        let folderPath = this.getPhotoFolderPath(resourceName, resourceId); //get default
        let smartCropAddition = useSmartCrop ? "-smart" : "";
        let fileExtension = useWebp ? ".webp" : ".jpg";
        let filePathResPhoto = path.join(folderPath, resourceId + "-" + resTag + smartCropAddition + fileExtension);
        return filePathResPhoto;
    }

    /**
     * Get the path to the original image file
     * @param resourceName the resource name / folder name
     * @param resourceId the id of the resource
     * @returns {*}
     */
    getFilePathForOriginalImage(resourceName, resourceId) {
        let folderPath = this.getPhotoFolderPath(resourceName, resourceId);
        let filePathOriginal = path.join(folderPath, 'photo.jpg');
        return filePathOriginal;
    }

    /**
     * IF the original Image exists, Gets the Path of an image with specified parameters.
     * @param resourceName The resource name / Folder name
     * @param resourceId the id of the resource
     * @param resTag The resolution tag
     * @param resolution
     * @param useSmartCrop
     * @param useWebp
     * @returns {Promise<null|*>}
     */
    async findOrCreateResolutionImage(resourceName, resourceId, resTag, useSmartCrop = true, useWebp = true) {
        let filePathOriginal = this.getFilePathForOriginalImage(resourceName, resourceId); //get original image
        if (resTag === DefaultPhotoHelper.originalResTag) { //if original image is wanted
            return filePathOriginal; //return it
        }

        //get the path to the specific image
        let filePathResPhoto = this.getFilePathForResolutionImage(resourceName, resourceId, resTag, useSmartCrop, useWebp);
        if (FileSystemHelper.doesPathExist(filePathResPhoto)) {
            //we found the resolution file, just return it
            return filePathResPhoto;
        } else {
            // well we need to create the resolution photo
            if (FileSystemHelper.doesPathExist(filePathOriginal)) {
                //but we got the original
                try {
                    sharp.cache(false); //disable sharp cache !
                    let image = await sharp(filePathOriginal); // load original image
                    let metadata = await image.metadata(); //get information about size and so

                    let resolution = DefaultPhotoHelper.resolutions[resTag];

                    let imageHeight = metadata.height;
                    let imageWidth = metadata.width;

                    if (imageHeight < resolution || imageWidth < resolution) {
                        //well no higher resolution possible
                        //send the original photo
                        return filePathOriginal;
                    }

                    let minimum = imageHeight < imageWidth ? imageHeight : imageWidth; //what is the smallest side
                    let width = minimum; //make quadratic image
                    let height = minimum;
                    let x = (imageWidth - width) / 2;
                    let y = (imageWidth - height) / 2;

                    if (useSmartCrop) { //if using smartcrop
                        let smartCropResult = await smartcrop.crop(filePathOriginal, {
                            width: minimum / 2,
                            height: minimum / 2
                        });
                        let topCrop = smartCropResult.topCrop; //get best crop of the image
                        width = topCrop.width;
                        height = topCrop.height;
                        x = topCrop.x; //get the dimension and the position
                        y = topCrop.y;
                    }

                    let adjustedImage = image.extract({left: x, top: y, width: width, height: height}) //crop it to rectangle
		    .rotate()
                    .resize(resolution, resolution); // resize
                    if (useWebp) { //if webp should be used
                        await adjustedImage.webp().toFile(filePathResPhoto); //change to webp
                        return filePathResPhoto;
                    } else {
                        await adjustedImage.png().toFile(filePathResPhoto);
                        return filePathResPhoto;
                    }
                    //TODO Handle if an error occured

                } catch (err) { // on any error get the original image
                    this.logger.error("[" + this.myExpressRouter.workerID + "][DefaultPhotoHelper] findOrCreateResolutionImage - " + err.toString());
                    //some shit happend, better send original
                    return filePathOriginal;
                }
            } else {
                //yeah, no original, no resolution photo, what do you expect
                //TODO search for other resolution photos maybe?
                return null;
            }
        }
    }


    /**
     * Handles a Get request for an image.
     * @param req The request object
     * @param res The resonse object
     * @param myAccessControl The access control instance
     * @param accessControlResource The permission resource which should be checked
     * @param resourceName The name of the resource
     * @param resourceId The id of the resource
     *
     * @apiDefine PhotoHelperGet
     * @apiParam (Query String) {String=original,high,medium,low,thumbnail} [resTag=medium] The desired Resolution.
     * @apiParam (Query String) {Boolean} [webp=true] Use of WebP Image Format. Otherwise PNG Format.
     * @apiParam (Query String) {Boolean} [smart=true] Use of smart cropping of the image.
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: NOT_FOUND, FORBIDDEN, INTERNAL_SERVER_ERROR
     * @apiError (Error) {String} error A description of the error
     */
    handlePhotoGet(req, res, myAccessControl, accessControlResource, resourceName, resourceId) {
        let permission = myAccessControl.can(req.locals.current_user.role).readAny(accessControlResource);
        if (permission.granted || developerAllowWithoutPermission) { //can get image
            let resTag = req.query.resTag || DefaultPhotoHelper.defaultResTag; //if none prodived set default
            let useSmartCrop = req.query.smart === "true"; //use smartcrop
            if (req.query.smart === undefined) {
                useSmartCrop = true;
            }

            let useWebp = req.query.webp === "true";
            if (req.query.webp === undefined) {
                useWebp = true;
            }

            if (resTag !== DefaultPhotoHelper.originalResTag && !DefaultPhotoHelper.resolutions[resTag]) { //if unkown set default
                resTag = DefaultPhotoHelper.defaultResTag;
            }

            this.findOrCreateResolutionImage(resourceName, resourceId, resTag, useSmartCrop, useWebp).then(pathToFile => {
                if (!pathToFile) { //if no path to file found
                    MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {"error": "Photo not found!"});
                    return;
                } else { //otherwise respond it
                    res.sendFile(pathToFile);
                    return;
                }
            }).catch(err => {
                this.logger.error("[" + this.myExpressRouter.workerID + "][DefaultPhotoHelper] handlePhotoGet - " + err.toString());
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {"error": err.toString()});

            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to get Photo Resource',
                [resourceName + "_id"]: resourceId
            });
        }
    }

    deleteAllResolutionPhotos(resourceName, resourceId) {
	let folderPath = this.getPhotoFolderPath(resourceName, resourceId);
	FileSystemHelper.deleteFolderRecursive(folderPath);
    }

    /**
     * Updates the TableUpdateTimes
     * @param sequelizeResource the resource
     */
    handleUpdateTableTimes(sequelizeResource) {
        this.myExpressRouter.defaultControllerHelper.updateTableUpdateTimes(sequelizeResource.constructor, true);
    }

    /**
     * Handles an Update or Create of an image.
     * @param req The request object
     * @param res The resonse object
     * @param myAccessControl The access control instance
     * @param accessControlResource The permission resource which should be checked
     * @param resourceName The name of the resource
     * @param resourceId The id of the resource
     *
     * @apiDefine PhotoHelperUpdate
     * @apiParam (Request file) {Image} file Image File
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR
     * @apiError (Error) {String} error A description of the error
     * @apiSuccess {Boolean} success On success this is true
     */
    handlePhotoUpdate(req, res, myAccessControl, accessControlResource, resourceName, resourceId) {
        let permission = myAccessControl.can(req.locals.current_user.role).updateAny(accessControlResource);

        this.logger.info("[" + this.myExpressRouter.workerID + "][DefaultPhotoHelper] handlePhotoUpdate - current_user.id: " + req.locals.current_user.id + " role: " + req.locals.current_user.role + " permission.granted: " + permission.granted);
        if (permission.granted || developerAllowWithoutPermission) { //can create an image
            if (!req.files) { // if no files given
                MyExpressRouter.responseWithJSON(res, HttpStatus.BAD_REQUEST, {"error": "Files uploaded are null?!"});
                return;
            }

            let photo = undefined;
            photo = req.files.photo;

            if (!photo) { // no photo privided ?
                MyExpressRouter.responseWithJSON(res, HttpStatus.BAD_REQUEST, {"error": "Input Field name has to be: photo!"});
                return;
            }

            let filePathOriginal = this.getFilePathForOriginalImage(resourceName, resourceId);
            FileSystemHelper.mkdirpathForFile(filePathOriginal); //Create Folder if does not exist
            this.deleteAllResolutionPhotos(resourceName, resourceId); //delete all old image files of the resource
	    FileSystemHelper.mkdirpathForFile(filePathOriginal); //Recreate Folder

            const photoHelper = this;

            photo.mv(filePathOriginal, function (err) { //place the image
                if (err) {
                    console.log("err: " + err.toString());
                    MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {"error": err.toString()});

                } else {
                    MyExpressRouter.responseWithJSON(res, HttpStatus.OK, {"success": true});
                    let instance = req.locals[resourceName]; //get the resource
                    instance.changed('updatedAt', true); //update resource itself
                    instance.save();
                    photoHelper.handleUpdateTableTimes(instance); //update the tabletimes
                }
            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to update Photo Resource',
                [resourceName + "_id"]: resourceId
            });

        }
    }

    /**
     *
     * @param req
     * @param res
     * @param myAccessControl
     * @param accessControlResource
     * @param resourceName
     * @param resourceId
     */
    handlePhotoDelete(req, res, myAccessControl, accessControlResource, resourceName, resourceId) {
        let permission = myAccessControl.can(req.locals.current_user.role).deleteAny(accessControlResource);
        this.logger.info("[" + this.myExpressRouter.workerID + "][DefaultPhotoHelper] handlePhotoDelete - current_user.id: " + req.locals.current_user.id + " role: " + req.locals.current_user.role + " permission.granted: " + permission.granted);
        let photoHelper = this;

        if (permission.granted || developerAllowWithoutPermission) {
            let filePathOriginal = this.getFilePathForOriginalImage(resourceName, resourceId);

            FileSystemHelper.mkdirpathForFile(filePathOriginal); //Check if Folder exists
            FileSystemHelper.deleteFile(filePathOriginal); //Delte the old Photo original

            this.deleteAllResolutionPhotos(resourceName, resourceId);

            MyExpressRouter.responseWithJSON(res, HttpStatus.OK, {"success": true});
            let instance = req.locals[resourceName];
            photoHelper.handleUpdateTableTimes(instance);
            instance.changed('updatedAt', true);
            instance.save();

        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: 'Forbidden to destroy Photo Resource',
                [resourceName + "_id"]: resourceId
            });

        }
    }
}
