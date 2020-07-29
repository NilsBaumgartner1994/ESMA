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
    Login.prototype.isOwn = async function(current_user) {
        let owner = await this.getUser();
        if(!!owner && !!current_user){
            console.log(owner);
            return owner.id === current_user.id;
        }
        return false;
    };
  return Login;
};
