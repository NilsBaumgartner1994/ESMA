'use strict';
/**
 * @apiDefine User User
 * Deletion will cause deletion of: Device, MealComments, MealRatings, Login
 */

/**
 * @api {MODEL} User User
 * @apiName ModelUser
 * @apiGroup 5Models
 *
 * @apiParam {Number} id Resource ID
 * @apiParam {Date} privacyPoliceReadDate The last date the user read the privacy policy
 *
 * @apiParam {Number} [CanteenId] [Canteen](#api-1._Models-ModelCanteen)'s Id in which a user eats
 * @apiParam {Number} [ResidenceId] [Residence](#api-1._Models-ModelResidence)'s Id in which a user lives
 *
 * @apiParam {String} [pseudonym] The nickname a user choosed
 * @apiParam {String="l","g","f"} [typefood] The foodtags a user likes
 * @apiParam {String} [language] The language a user uses
 * @apiParam {JSON} [avatar] The avatar of the user
 * @apiParam {Date} [online_time] The last time the user was online
 *
 * @apiParam {Date} [createdAt] The date the resource was created
 * @apiParam {Date} [updatedAt] The date the resource was updated
 *
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    pseudonym: DataTypes.STRING,
    language: DataTypes.STRING,
    avatar: DataTypes.JSON,
    online_time: DataTypes.DATE,
    privacyPolicyReadDate: {type: DataTypes.DATE, allowNull: false} //required
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.belongsToMany(
          models.User,
          {
              through: 'UserFriends',
              as: "Friends",
              foreignKey: {name: 'UserId'},
              otherKey: 'FriendId',
              onUpdate: "CASCADE",
              onDelete: 'CASCADE'
          }
      );
      User.belongsToMany(
          models.User,
          {
              through: 'UserFriendRequests',
              as: "OutgoingFriendRequests",
              foreignKey: {name: 'UserId'},
              otherKey: {name: 'FriendId'},
              onUpdate: "CASCADE",
              onDelete: 'CASCADE'
          }
      );
      User.belongsToMany(
          models.User,
          {
              through: 'UserFriendRequests',
              as: "IncommingFriendRequests",
              foreignKey: {name: 'FriendId'},
              otherKey: {name: 'UserId'},
              onUpdate: "CASCADE",
              onDelete: 'CASCADE'
          }
      );
    User.hasOne(
        models.Login
    );
      User.hasOne(
          models.Device,
	  {
          onUpdate: "CASCADE",
          onDelete: 'CASCADE',
        }
      );
/**
      User.hasOne(
          models.Role,
          {
              through: 'UserRoles',
	      onUpdate: 'CASCADE',
	      onDelete: 'CASCADE',
          }
      );
*/
      User.hasMany(
          models.Feedback,
      );
  };
  return User;
};
