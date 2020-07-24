/**
 * A simple SequelizeHelper
 */
export default class SequelizeHelper {

    /**
     * Get all tables in the database
     * @param models the models
     */
    static getModelJSON(models){
        return models.sequelize.models;
    }

    static getTableName(model){
        return model.tableName;
    }

    static getPrimaryKeyAttributes(model){
        return model.primaryKeyAttributes;
    }

    static getAssociationForModelJSON(model){
        const result = [];
        if (!model || typeof model.associations !== 'object') {
            throw new Error("Model should be an object with the 'associations' property.");
        }

        Object.keys(model.associations).forEach((key) => {
            const association = {};

            // all needed information in the 'options' object
            if (model.associations[key].hasOwnProperty('options')) {
                association[key] = model.associations[key].options;
            }

            result.push(association);
        });

        return result;
    }

}
