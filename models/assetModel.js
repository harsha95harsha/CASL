const { DataTypes } = require('sequelize');






function assetModel (sequelize) {
  const attributes = {
        asset_sno:{
         type:DataTypes.INTEGER,
         allowNull: false,
         autoIncrement:true,
         primaryKey: true,
       },
       asset_name:{
        type:DataTypes.STRING,
        allowNull:false

       },
       asset_id:{
        type:DataTypes.STRING,
        allowNull:false
       },
       user:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
          model:'User',
          key:'user_sno'
        },
       },
       product:{
        type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                  model: 'Product',
                  key: 'product_sno',
                },
       }
       
      };
      const options = {
        sequelize,
        modelName: "Asset",
        freezeTableName: true,
        timestamps: false,
      };

      const Asset = sequelize.define("Asset", attributes, options);

      return Asset;
}
module.exports = assetModel;
