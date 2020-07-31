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
        message: {
            type: DataTypes.STRING(2048),
            validate: {
                len: [2,2048],
            }
        },
        label: {
            type: DataTypes.STRING(255),
            validate: {
                len: [2,2048],
            }
        },
    }, {});
    Feedback.associate = function(models) {
        // associations can be defined here
        Feedback.belongsTo(models.User, {
            onUpdate: "CASCADE",
            onDelete: 'SET NULL' //when the user is destroyed, we want to keep the feedback
        });
    };
    Feedback.prototype.isOwn = async function(current_user) {
        let owner = await this.getUser();
        if(!!owner && !!current_user){
            console.log(owner);
            return owner.id === current_user.id;
        }
        return false;
    };
    return Feedback;
};