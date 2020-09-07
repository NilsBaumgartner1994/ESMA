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
  const Task = sequelize.define('Task', {
    name: {type: DataTypes.STRING, allowNull: false}, //required
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
    Task.belongsTo(
        models.Exam,
        {
          onUpdate: "CASCADE",
          onDelete: 'CASCADE'
        }
    );
    Task.belongsTo(
        models.Task,
        {
          as: "NextTask",
          onUpdate: "CASCADE",
          onDelete: 'SET NULL'
        }
    );
    Task.belongsToMany(
        models.Classification,
        {
          through: 'TaskClassifications',
        }
    );
    Task.belongsToMany(
        models.Examtype,
        {
          through: 'TaskExamtypes',
        }
    );
    Task.belongsToMany(
        models.Topic,
        {
          through: 'TaskTopics',
        }
    );
  };
  return Task;
};
