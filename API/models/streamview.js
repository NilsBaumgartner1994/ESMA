'use strict';
/**
 * @apiDefine StreamView StreamView
 * StreamViews are a representations of an action a user performs. It can be compared to a history entry.
 */

/**
 * @api {MODEL} StreamView StreamView
 * @apiName ModelStreamView
 * @apiGroup 5Models
 *
 * @apiParam {Number} id Resource ID
 * @apiParam {String} screen The name of the opened screen in the app
 * @apiParam {Date} eventTime The date this event occured
 *
 * @apiParam {Number} [DeviceId] [Device](#api-1._Models-ModelDevice)'s Id
 * @apiParam {String} [event] A special event this event was triggered
 * @apiParam {JSON} [props] Additional properties for this event
 *
 * @apiParam {Date} [createdAt] The date the resource was created
 * @apiParam {Date} [updatedAt] The date the resource was updated
 *
 */
module.exports = (sequelize, DataTypes) => {
  const StreamView = sequelize.define('StreamView', {
    screen: {type: DataTypes.STRING, allowNull: false}, //required
    event: DataTypes.STRING,
    props: DataTypes.JSON,
    eventTime: {type: DataTypes.DATE, allowNull: false} //required
  }, {});
  StreamView.associate = function(models) {
    // associations can be defined here
    StreamView.belongsTo(models.Device,
        {
          onUpdate: "CASCADE",
          onDelete: "CASCADE" // is user deletes device, then we better delete all corresponding streamviews
        });
  };
  return StreamView;
};
