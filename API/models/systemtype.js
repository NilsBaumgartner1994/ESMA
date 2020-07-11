'use strict';
module.exports = (sequelize, DataTypes) => {
  const SystemType = sequelize.define('SystemType', {
    name: DataTypes.STRING,
    version: DataTypes.STRING
  }, {});
  SystemType.associate = function(models) {
    // associations can be defined here
  };
  return SystemType;
};