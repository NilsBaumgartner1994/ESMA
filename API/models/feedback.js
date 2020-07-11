'use strict';
/**
 * @apiDefine Feedback Feedback
 * A Feedback is an information a user gives about his opinion of the system.
 */

/**
 * @api {MODEL} Feedback Feedback
 * @apiName ModelFeedback
 * @apiGroup 5Models
 *
 * @apiParam {Number} id Resource ID
 *
 * @apiParam {Number} [UserId] [User](#api-1._Models-ModelUser)'s Id
 * @apiParam {String} [message] The message of the Feedback
 * @apiParam {String} [label] A label of the feedback like "bug", "problem", ...
 *
 * @apiParam {Date} [createdAt] The date the resource was created
 * @apiParam {Date} [updatedAt] The date the resource was updated
 */
module.exports = (sequelize, DataTypes) => {
    const Feedback = sequelize.define('Feedback', {
        message: DataTypes.STRING,
        label: DataTypes.STRING
    }, {});
    Feedback.associate = function(models) {
        // associations can be defined here
        Feedback.belongsTo(models.User, {
            onUpdate: "CASCADE",
            onDelete: 'SET NULL' //when the user is destroyed, we want to keep the feedback
        });
    };
    return Feedback;
};