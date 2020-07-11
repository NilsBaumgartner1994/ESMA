'use strict';
module.exports = (sequelize, DataTypes) => {
  const Login = sequelize.define('Login', {
    hashedSecretKey: {type: DataTypes.STRING, allowNull: false},
    salt: {type: DataTypes.STRING, allowNull: false}
  }, {});
  Login.associate = function(models) {
    // associations can be defined here
    Login.belongsTo(models.User,
        {
          onUpdate: "CASCADE",
          onDelete: 'CASCADE' // destroy login when user is destroyed
        });
  };
  return Login;
};
