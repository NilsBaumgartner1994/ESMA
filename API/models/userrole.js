'use strict';
/**
 * @apiDefine UserRole UserRole
 * User's can have different Roles. This association is represented by the table UserRoles.
 */

/**
 * @api {MODEL} UserRole UserRole
 * @apiName ModelUserRole
 * @apiGroup 5Models
 *
 * @apiParam {Number} UserId [UserId](#api-1._Models-ModelUser)'s Id
 * @apiParam {Number} RoleId [Role](#api-1._Models-ModelRole)'s Id
 *
 * @apiParam {String} [beginnAt] The date the authorization is starting
 * @apiParam {JSON} [endAt] The date the authorization will expired
 *
 * @apiParam {Date} [createdAt] The date the resource was created
 * @apiParam {Date} [updatedAt] The date the resource was updated
 *
 */
module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
      RoleId: {type: DataTypes.INTEGER, allowNull: false}, //required
      UserId: {type: DataTypes.INTEGER, allowNull: false}, //required
      beginnAt: DataTypes.DATE,
      endAt: DataTypes.DATE,
  }, {});
    UserRole.removeAttribute('id');
    UserRole.associate = function(models) {
    // associations can be defined here

        UserRole.belongsTo(
          models.User,
          {
	      sourceKey: {name: "UserId"},
              onUpdate: "CASCADE",
              onDelete: 'CASCADE' //not sure if needed
          }
      );
        UserRole.belongsTo(
            models.Role,
            {
		sourceKey: {name: "RoleId"},
                onUpdate: "CASCADE",
                onDelete: 'CASCADE' //not sure if needed
            }
        );

  };
  return UserRole;
};
