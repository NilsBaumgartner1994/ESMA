import FileSystemHelper from "../helper/FileSystemHelper";
import config from "../../config/config.json"; //static configs
import DateHelper from "./../helper/DateHelper";

const compressing = require('compressing');
const env = process.env.NODE_ENV || 'production';
const {exec} = require("child_process"); //execute console commands
const path = require('path');
const fs = require("fs"); //file-system

/**
 * The Database Backup module handles backup creation and restoring of the database itself. Images are not backuped itself.
 */
export default class DatabaseBackupModule {

    /**
     * Constructor for Logging
     * @param logger The logger class
     */
    constructor(logger) {
        this.logger = logger;
    }

    /**
     * Gets the database depending on the enviroment
     * @returns {String} the Database name
     */
    getDatabaseName() {
        return config[env].database;
    }

    /**
     * Get the username used for login into database
     * @returns {String} the username
     */
    getUsername() {
        return config[env].username;
    }

    /**
     * Gets the password for the database
     * @returns {String} the password for the database
     */
    getPassword() {
        return config[env].password;
    }

    /**
     * Get the Compressed Backup File Extension name like png, jpeg zip
     * @returns {string} the compressed file extenstion
     */
    getCompressFileEnding() {
        return "gz";
    }

    /**
     * Get the exported uncompromised backup file extension name
     * @returns {string} the uncompressed backup extension name
     */
    getRawFileEnding() {
        return "sql";
    }

    /**
     * Get the prefix for a backup initiated by the user
     * @returns {string} the file prefix
     */
    getPrefixForCustomBackups() {
        return "custom-";
    }

    /**
     * Get the command as string for the database export
     * @param sqlFile The path to the sql file the raw backup should be put
     * @param dataOnly Optional Boolean if only the data itself should be exported. Not recomended ! Better use true !
     * @returns {string} The command for database export
     */
    generateExportCommand(sqlFile, dataOnly = true) {
        let dataOnlyOption = dataOnly ? "--no-create-info " : "";

        let database = this.getDatabaseName();
        let username = this.getUsername();
        let password = this.getPassword();

        //https://makandracards.com/makandra/595-dumping-and-importing-from-to-mysql-in-an-utf-8-safe-way
        let correctlyEncode = "--default-character-set=latin1"; //encode the data correctly !

        //beware -pPassword is correct, there is no space bewteen
        let command = "mysqldump -u " + username + " -p" + password + " " + correctlyEncode + " " + dataOnlyOption + "--databases " + database + " > " + sqlFile;
        return command;
    }

    /**
     * Generate the import command for database import
     * @param sqlFile The sql file for import
     * @returns {string} The command for database import
     */
    generateImportCommand(sqlFile) {
        let username = this.getUsername();
        let password = this.getPassword();
        //TODO check if "--default-character-set=latin1" is needed ?
        let command = "mysql -u " + username + " -p" + password + " < " + sqlFile;

        return command;
    }

    /**
     * Generate a backup filename with a unique name, depending on the time
     * @returns {string}
     */
    generateFileName() {
        let now = new Date();
        let database = this.getDatabaseName();
        let fileName = database + "-" + DateHelper.dateToYYYYMMDDHHMMSS(now);
        return fileName;
    }

    /**
     * Gets the path to the backup folder for databases
     * @returns {string}
     */
    getPathToBackups() {
        let ownPath = fs.realpathSync('.');
        let filePath = path.join(ownPath, "backups", "database");
        return filePath;
    }

    /**
     * Gets all Backup File NAMES, not the actual path
     * @returns {*[string]}
     */
    getAllBackupFileNames() {
        let backupPath = this.getPathToBackups(); //get path to backup folder
        let backupFileNames = FileSystemHelper.getAllFilesFormPath(backupPath); //get all files in this backup folder
        let compressedFileEnding = this.getCompressFileEnding();
        backupFileNames = backupFileNames.filter(function (file) { //filter files which
            return file.indexOf("." + compressedFileEnding) !== -1; //are not compressed backup files
        });
        return backupFileNames;
    }

    /**
     * Gets all Backup file PATHS
     * @returns {*[String]} the paths to the backups
     */
    getAllBackupFilePaths() {
        let backupFileNames = this.getAllBackupFileNames(); //get all backup file names
        let backupFiles = [];
        for (let i = 0; i < backupFileNames.length; i++) { //for all backup file names
            backupFiles.push(this.getBackupFilePath(backupFileNames[i])); //get the path to them
        }
        return backupFiles;
    }

    /**
     * Get the Path to a Backup
     * @param backupFileName The backup file name
     * @returns {string} the path to the backup
     */
    getBackupFilePath(backupFileName) {
        let backupPath = this.getPathToBackups();
        return path.join(backupPath, backupFileName);
    }

    /**
     * Get informations about all backups
     * @returns {Array}
     */
    getAllBackupsInformation() {
        let allBackupFileNames = this.getAllBackupFileNames(); //get all backup file names
        let list = [];
        for (let i = 0; i < allBackupFileNames.length; i++) { //for all backup file names
            list.push(this.getBackupInformation(allBackupFileNames[i])); //get information of them
        }
        return list;
    }

    /**
     * Get Informations about a Backup file
     * @param backupFileName A backup file name
     * @returns {{createdAt: Date, id: *, backupFilePath: string, updatedAt: Date}}
     */
    getBackupInformation(backupFileName) {
        let backupFilePath = this.getBackupFilePath(backupFileName); //get the path of a backup
        let createdAt = FileSystemHelper.getCreatedDate(backupFilePath);
        let updatedAt = FileSystemHelper.getFileUpdatedDate(backupFilePath);
        return {
            id: backupFileName,
            backupFilePath: backupFilePath,
            createdAt: createdAt,
            updatedAt: updatedAt
        }
    }

    /**
     * Export the database to a file
     * @param usePrefixCustom Optional Boolean use
     * @returns {Promise<any>} Promise on success export is path to compressed file
     */
    exportDatabase(usePrefixCustom = false) {
        const instance = this;

        //get the name for the export
        let fileName = this.generateFileName();
        if (usePrefixCustom) {
            fileName = this.getPrefixForCustomBackups() + fileName;
        }

        //get the path to the export file path
        let backupPath = path.join(this.getPathToBackups(), fileName);
        const sqlFile = backupPath + "." + this.getRawFileEnding(); //get the raw backup file path
        const compressedFile = sqlFile + "." + this.getCompressFileEnding(); //get the compressed backup file path

        let command = this.generateExportCommand(sqlFile, false); //get

        this.logger.info("[DatabaseBackupModule] command: " + command);

        let promise = new Promise(function (resolve, reject) { //create new promise you can wait on
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error}`);
                    instance.logger.error(`error: ${error}`);
                    reject(error); //on any error reject promise
                    return;
                }
                if (stderr) { // mimimi error
                    // stderr: mysqldump: [Warning] Using a password on the command line interface can be insecure.
                    //console.log(`stderr: ${stderr}`);
                    instance.logger.error(`stderr: ${stderr}`);
                    //return;
                }
                instance.logger.info("[DatabaseBackupModule] : Database created raw backup");
                compressing.gzip.compressFile(sqlFile, compressedFile) //compress file
                .then(() => { //when finished
                    instance.logger.info("[DatabaseBackupModule] : Database created compressed backup from raw backup");
                    FileSystemHelper.deleteFile(sqlFile); //delete old raw file
                    instance.logger.info("[DatabaseBackupModule] : Database deleted raw backup");
                    resolve(compressedFile); //finish promise
                })
                .catch((err) => { //on any error
                    instance.logger.error("[DatabaseBackupModule] : " + err.toString());
                    reject(err); //reject promise to throw an error
                });
            });
        });

        return promise;
    }

    /**
     * Restore the Database from a compressed backup file
     * @param compressedFile The path to the compressed backup
     * @returns {Promise<any>} On Success Promise returns true
     */
    restoreDatabaseWithCompressedFile(compressedFile) {
        const instance = this;
        let parsed = path.parse(compressedFile); //parse the path of compresed backup for Ex. backup.sql.gz
        const uncompressed = path.join(parsed.dir, parsed.name); //get uncompress path backup.sql since .gz is removed
        let promise = new Promise(function (resolve, reject) { //create new promise
            compressing.gzip.uncompress(compressedFile, uncompressed) //uncompress the backup
            .then(() => { //when uncompressed
                instance.logger.info("[DatabaseBackupModule] : Database created raw backup from compressed backup");
                let command = instance.generateImportCommand(uncompressed); //generate import command
                exec(command, (error, stdout, stderr) => { //execute
                    if (error) {
                        console.log(`error: ${error}`);
                        instance.logger.error(`error: ${error}`);
                        reject(error); //on any error reject promise
                        return;
                    }
                    if (stderr) { // mimimi error
                        // stderr: mysqldump: [Warning] Using a password on the command line interface can be insecure.
                        //console.log(`stderr: ${stderr}`);
                        instance.logger.error(`stderr: ${stderr}`);
                        //return;
                    }
                    instance.logger.info("[DatabaseBackupModule] : Database imported raw backup");
                    FileSystemHelper.deleteFile(uncompressed); //delete uncompressed file
                    instance.logger.info("[DatabaseBackupModule] : Database deleted decompressed raw backup");
                    instance.logger.info(`stdout: ${stdout}`);
                    resolve(true);
                });
            })
            .catch((err) => {
                instance.logger.error("[DatabaseBackupModule] : " + err.toString());
                reject(err);
            });
        });
        return promise;
    }


}
