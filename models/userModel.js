const { DataTypes } = require('sequelize');

function userModel (sequelize) {
  const attributes = {
    user_sno:{
      type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement:true,
            primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password:{
      type:DataTypes.STRING(200),
      allowNull:true,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
    },
  };
      const options = {
        sequelize,
        modelName: "User",
        freezeTableName: true,
        timestamps: false,
      };

      const User = sequelize.define("User", attributes, options);

      return User;
    }
    module.exports = userModel;
