const { DataTypes } = require('sequelize');





function categoryModel (sequelize) {
  const attributes = {
        category_sno:{
         type:DataTypes.INTEGER,
         allowNull: false,
         autoIncrement:true,
         primaryKey: true,
       },
       category_name:{
        type:DataTypes.STRING,
        allowNull:false
       },
       catgory_id:{
        type:DataTypes.STRING,
        allowNull:false
       },
      };
      const options = {
        sequelize,
        modelName: "Category",
        freezeTableName: true,
        timestamps: false,
      };

      const Category = sequelize.define("Category", attributes, options);

      return Category;
}
module.exports = categoryModel;
