import MyExpressRouter from "../module/MyExpressRouter";
import HttpStatus from "http-status-codes";
import DatabaseBackupModule from "../module/DatabaseBackupModule";
import FileSystemHelper from "../helper/FileSystemHelper";
import path from "path";

/**
 * @apiDefine Backup Backup
 * Backups are complete representations of all database informations. Be carefull !
 */
export default class Function_BackupController {
    constructor(logger, models, expressApp, myAccessControl, myExpressRouter) {
        this.logger = logger;
        this.models = models;
        this.expressApp = expressApp;
        this.myAccessControl = myAccessControl;
        this.myExpressRouter = myExpressRouter;
        this.databaseBackupModule = new DatabaseBackupModule(logger);
        this.prepareRoutes();
        this.configureRoutes();
        this.logger.info(
            "[" +
            this.myExpressRouter.workerID +
            "][Function_BackupController] initialised"
        );
    }

    prepareRoutes() {
        this.resource_id_parameter =
            MyExpressRouter.function_backup_resource_id_parameter;
        this.routeResources = MyExpressRouter.function_routeBackups;
        this.routeResource = MyExpressRouter.function_routeBackup;
        this.accessControlResource =
            MyExpressRouter.function_backup_accessControlResouce;
        this.resourceName = MyExpressRouter.function_backup_resourceName;
        this.routeBackupRestore = MyExpressRouter.function_routeBackupRestore;
        this.routeBackupDownload = MyExpressRouter.function_routeBackupDownload;
        this.routeBackupCreate = MyExpressRouter.function_routeBackupCreate;
    }

    configureRoutes() {
        //Param Checker
        this.expressApp.param(
            this.resource_id_parameter,
            this.paramcheckerResourceId.bind(this)
        );

        //Resources
        this.expressApp.get(this.routeResources, this.handleIndex.bind(this)); //Index

        //Resource
        this.expressApp.get(this.routeResource, this.handleGet.bind(this)); //Read
        this.expressApp.post(this.routeResources, this.handleFileUpload.bind(this)); // Create
        this.expressApp.delete(
            this.routeResource,
            this.handleBackupDelete.bind(this)
        ); //Delelte

        // Special
        this.expressApp.get(
            this.routeBackupDownload,
            this.handleDownload.bind(this)
        ); //download Backups
        this.expressApp.get(this.routeBackupCreate, this.handleCreate.bind(this)); //create Backup from Database
        this.expressApp.get(
            this.routeBackupRestore,
            this.handleBackupRestore.bind(this)
        );//restore database from backup
    }

    //to check if that backup file exists
    paramcheckerResourceId(req, res, next, resource_id) {
        this.logger.info(
            "[Function_BackupController] paramcheckerResourceId - " +
            this.resourceName +
            " resource_id: " +
            resource_id
        );
        let allBackupFileNames = this.databaseBackupModule.getAllBackupFileNames(); //get all backup file names
        for (let i = 0; i < allBackupFileNames.length; i++) {
            if (resource_id === allBackupFileNames[i]) {
                req.locals[this.resourceName] = resource_id; //save the found resource id
                next(); //nice proceed we found one
                return;
            }
        }
        //sorry iterated all, none matched
        MyExpressRouter.responseWithJSON(res, HttpStatus.NOT_FOUND, {
            error: this.resourceName + "_id not found",
            [this.resourceName + "_id"]: resource_id
        });

    }

    /**
     * Routes
     */

    /**
     * @api {get} /api/functions/backups All Backup Informations
     * @apiName IndexFunctionBackups
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Backup
     *
     * @apiSuccess {List[JSON]} resources List of Backup file informations.
     * @apiUse DefaultControllerIndex
     * @apiDescription Lists all backup names
     */
    async handleIndex(req, res) {
        let permission = this.myAccessControl
        .can(req.locals.current_user.role)
        .readAny(this.accessControlResource);
        if (permission.granted) {//are you allowed to see all
            let allBackupFileInformations = this.databaseBackupModule.getAllBackupsInformation(); //well get all backupinformations
            MyExpressRouter.responseWithJSON(
                res,
                HttpStatus.OK,
                allBackupFileInformations
            );

        } else { //no you filthy fool, go home, you are not allowed
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: "Forbidden to get Resource:s " + this.resourceName
            });

        }
    }

    /**
     * @api {get} /api/functions/backups/:id Get Backup Information
     * @apiName GetBackup
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Backup
     *
     * @apiParam {String} id Backup's unique ID.
     *
     * @apiSuccess {JSON} resource The information of the backup
     * @apiUse DefaultControllerGet
     */
    handleGet(req, res) {
        let permission = this.myAccessControl
        .can(req.locals.current_user.role)
        .readAny(this.accessControlResource);
        if (permission.granted) { //can you get a single backup information
            let backup_id = req.locals[this.resourceName];
            let json = this.databaseBackupModule.getBackupInformation(backup_id); //get the information
            MyExpressRouter.responseWithJSON(res, HttpStatus.OK, json);

        } else { //no get out
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: "Forbidden to get Resource: " + this.resourceName
            });

        }
    }

    /**
     * @api {get} /api/functions/backups/:id/download Download Backup
     * @apiName DownloadBackup
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Backup
     *
     * @apiParam {String} id Backup's unique ID.
     *
     * @apiSuccess {SQL} resource The compressed SQL File of the backup.
     * @apiUse DefaultControllerGet
     */
    handleDownload(req, res) {
        let permission = this.myAccessControl
        .can(req.locals.current_user.role)
        .readAny(this.accessControlResource);
        if (permission.granted) { //can you download any ? same as get information
            let backup_id = req.locals[this.resourceName];
            let pathToFile = this.databaseBackupModule.getBackupFilePath(backup_id); //get the file path
            res.sendFile(pathToFile); //nice i send you the file

        } else { //hell no, get out
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: "Forbidden to download Resource: " + this.resourceName
            });

        }
    }

    /**
     * @api {get} /api/functions/backups/:id/create Create Backup
     * @apiName CreateBackup
     * @apiDescription With this endpoint an automatic backup will be created
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Backup
     *
     * @apiParam {String} id Backup's unique ID.
     *
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR
     * @apiError (Error) {String} error A description of the error
     * @apiSuccess {Boolean} success On success this is true
     */
    handleCreate(req, res) {
        let permission = this.myAccessControl
        .can(req.locals.current_user.role)
        .createAny(this.accessControlResource);
        if (permission.granted) { //okay lets see if you allowed to create a database export
            this.databaseBackupModule.exportDatabase(true).then(exportedFilePath => {//please create a custom export
                MyExpressRouter.responseWithJSON(res, HttpStatus.OK, {success: true, path: exportedFilePath}); //answe yes
            }).catch(err => {
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                    error: "Could not create Backup",
                    more: err.toString()
                });
            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: "Forbidden to create Resource: " + this.resourceName
            });

        }
    }

    /**
     * @api {post} /api/functions/backups Upload Backup
     * @apiName UploadBackupFile
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Backup
     *
     * @apiHeader {String=multipart/form-data} Content-Type
     *
     * @apiParam (Request file) {GZip} file SQL File as GZip
     *
     * @apiError (Error) {Number} errorCode The HTTP-Code of the error. Possible Errors: BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR
     * @apiError (Error) {String} error A description of the error
     * @apiSuccess {Boolean} success On success this is true
     */
    handleFileUpload(req, res) {
        let permission = this.myAccessControl
        .can(req.locals.current_user.role)
        .createAny(this.accessControlResource);
        if (permission.granted) { //can you upload any ?
            if (req.files === null || req.files === undefined) { //have you given me any file ?
                MyExpressRouter.responseWithJSON(res, HttpStatus.BAD_REQUEST, {
                    error: "Files uploaded are null?!"
                }); //im sorry please try again ?
                return;
            }

            let backup = undefined;
            backup = req.files.backup; //nice lets get the backup file

            if (backup === undefined) { //whoo you named it other ? im sorry
                MyExpressRouter.responseWithJSON(res, HttpStatus.BAD_REQUEST, {
                    error: "Input Field name has to be: backup!"
                });
                return;
            }

            let name = backup.originalFilename || backup.name || backup.filename; //for custom file name
            if (!name) {
                // if no name was provided we use generated name
                name =
                    this.databaseBackupModule.getPrefixForCustomBackups() +
                    this.databaseBackupModule.generateFileName() +
                    "." +
                    this.databaseBackupModule.getCompressFileEnding(); //generated file names
            }

            let pathToBackups = this.databaseBackupModule.getPathToBackups();

            let filePathOriginal = path.join(pathToBackups, name);
            console.log(
                "Function_BackupController: backup: " + JSON.stringify(backup)
            );
            console.log(
                "Function_BackupController: filePathOriginal: " + filePathOriginal
            );
            FileSystemHelper.mkdirpathForFile(filePathOriginal); //Check if Folder exists
            FileSystemHelper.deleteFile(filePathOriginal); //Delte the old File

            backup.mv(filePathOriginal, function (err) { //move the file, mayby overrite it, i dont care
                if (err) {
                    console.log("err: " + err.toString());
                    MyExpressRouter.responseWithJSON(
                        res,
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        {error: err.toString()}
                    );

                } else {
                    console.log("Function_BackupController file uploaded");
                    MyExpressRouter.responseWithJSON(res, HttpStatus.OK, {
                        success: "Okay files received"
                    });

                }
            });
        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: "Forbidden to update Backup Resource",
                [resourceName + "_id"]: resourceId
            });

        }
    }

    /**
     * @api {delete} /api/functions/backups/:id/ Delete Backup File
     * @apiName DeleteBackupFile
     * @apiPermission Admin
     * @apiUse SwosyAuthorization
     * @apiGroup Backup
     *
     * @apiParam {String} id Backup's unique ID.
     *
     * @apiUse DefaultControllerDelete
     *
     * @apiExample Example usage:
     * curl -X DELETE http://localhost/api/functions/backup/test.gz/
     */
    handleBackupDelete(req, res) {
        let permission = this.myAccessControl
        .can(req.locals.current_user.role)
        .deleteAny(this.accessControlResource);
        this.logger.info(
            "[" +
            this.myExpressRouter.workerID +
            "][Function_BackupController] handleBackupDelete - current_user.id: " +
            req.locals.current_user.id +
            " role: " +
            req.locals.current_user.role +
            " permission.granted: " +
            permission.granted
        );

        if (permission.granted) { //are you allowed to delete the backup ?
            let backup_id = req.locals[this.resourceName];
            let pathToFile = this.databaseBackupModule.getBackupFilePath(backup_id);

            FileSystemHelper.mkdirpathForFile(pathToFile); //Check if Folder exists
            FileSystemHelper.deleteFile(pathToFile); //Delte the old Photo original

            MyExpressRouter.responseWithJSON(res, HttpStatus.OK, {success: true});

        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error: "Forbidden to destroy Photo Resource",
                [resourceName + "_id"]: resourceId
            });

        }
    }

    /**
     * @api {get} /api/functions/backups/:id/restore Restore Backup
     * @apiDescription Caution ! This will reset the whole Database to the backup ! Please make a backup before using this !
     * @apiName RestoreBackup
     * @apiPermission Admin delete:any create:any Function_Database
     * @apiUse SwosyAuthorization
     * @apiGroup Backup
     *
     * @apiParam {String} id Backup's unique ID.
     *
     * @apiSuccess {Boolean} success On success this is true
     * @apiUse DefaultControllerGet
     */
    handleBackupRestore(req, res) {
        let permissionReadBackup = this.myAccessControl
        .can(req.locals.current_user.role)
        .readAny(this.accessControlResource);
        let permissionDelete = this.myAccessControl
        .can(req.locals.current_user.role)
        .deleteAny(MyExpressRouter.function_database_accessControlResource);
        let permissionCreate = this.myAccessControl
        .can(req.locals.current_user.role)
        .createAny(MyExpressRouter.function_database_accessControlResource);

        this.logger.info(
            "[" +
            this.myExpressRouter.workerID +
            "][Function_BackupController] handleBackupRestore - current_user.id: " +
            req.locals.current_user.id +
            " role: " +
            req.locals.current_user.role +
            " permissionReadBackup.granted: " +
            permissionReadBackup.granted +
            " permissionDelete.granted: " +
            permissionDelete.granted +
            " permissionCreate.granted: " +
            permissionCreate.granted
        );

        if ( // you want to restore the whole database ? you need a couple permissions for that
            permissionReadBackup.granted && //can you read the backup
            permissionDelete.granted && //can you delete the old one ?
            permissionCreate.granted //can you create the new database ?
        ) {
            //well seems so
            let backup_id = req.locals[this.resourceName];
            let compressedFile = this.databaseBackupModule.getBackupFilePath(
                backup_id
            );
            //TODO make this async an then answer
            this.databaseBackupModule.restoreDatabaseWithCompressedFile(
                compressedFile
            ).then(success => {
                MyExpressRouter.responseWithJSON(res, HttpStatus.OK, {success: true});
            }).catch(err => {
                MyExpressRouter.responseWithJSON(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                    error: "Could not restore Database",
                    more: err.toString()
                });
            });

        } else {
            MyExpressRouter.responseWithJSON(res, HttpStatus.FORBIDDEN, {
                errorCode: HttpStatus.FORBIDDEN,
                error:
                    "Forbidden to destroy/create Resource: " +
                    MyExpressRouter.function_database_resourceName
            });

        }
    }
}
