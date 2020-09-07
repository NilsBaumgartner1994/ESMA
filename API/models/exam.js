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
  const Exam = sequelize.define('Exam', {
    name: {type: DataTypes.STRING, allowNull: false}, //required
    year: {type: DataTypes.STRING, allowNull: false}, //required

    startDate: {type: DataTypes.DATE, allowNull: false}, //required
    endDate: {type: DataTypes.DATE, allowNull: false}, //required
  }, {});
  Exam.associate = function(models) {
    // associations can be defined here
      Exam.hasMany(
          models.Task,
      );
      Exam.belongsTo(
          models.Examtype
      );
      Exam.belongsToMany(
          models.Student,
          {
              through: 'ExamStudents',
          }
      );
  };
  return Exam;
};
