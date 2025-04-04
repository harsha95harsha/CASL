const { DataTypes } = require('sequelize');






function permissionsModel (sequelize) {
  const attributes = {
        permission_sno:{
         type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
        allowNull:false,
       },
       user_sno:{ 
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
          model:'User',
          key:'user_sno'
        },

       },
       action:{
        type:DataTypes.STRING,
        allowNull:false
       },
       subject:{
        type:DataTypes.STRING,
        allowNull:false,
        
       },
      
       
      };
      const options = {
        sequelize,
        modelName: "Permission",
        freezeTableName: true,
        timestamps: false,
      };

      const Permission = sequelize.define("Permission", attributes, options);

      return Permission;
}
module.exports = permissionsModel;
