'use strict';
/**
 * @apiDefine Device Device
 * A Device represents a real world device of a user. Deletion will cause deletion of: StreamViews
 */

/**
 * @api {MODEL} Device Device
 * @apiName ModelDevice
 * @apiGroup 5Models
 *
 * @apiParam {Number} id Resource ID
 * @apiParam {Number} UserId [User](#api-1._Models-ModelUser)'s Id
 *
 * @apiParam {String} [pushNotificationToken] The Push-Notification Token of the device
 * @apiParam {String} [os] The operating system of the device
 * @apiParam {String} [version] The version of the device's operating system
 *
 * @apiParam {Date} [createdAt] The date the resource was created
 * @apiParam {Date} [updatedAt] The date the resource was updated
 */
module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    pushNotificationToken: DataTypes.STRING,
      os: DataTypes.STRING,
      version: DataTypes.STRING
  }, {});
  Device.associate = function(models) {
    // associations can be defined here
    Device.belongsTo(models.User,
        {
          onUpdate: "CASCADE",
          onDelete: "CASCADE", //when user is destroyed, the device can not exist any more
        });
      Device.hasMany(models.StreamView);
  };
    Device.prototype.isOwn = async function(current_user) {
        let owner = await this.getUser();
        if(!!owner && !!current_user){
            console.log(owner);
            return owner.id === current_user.id;
        }
        return false;
    };
  return Device;
};
