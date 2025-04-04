const { DataTypes } = require('sequelize');
const { all } = require('../routes/articleRoutes');





function productModel (sequelize) {
  const attributes = {
        product_sno:{
         type:DataTypes.INTEGER,
         allowNull: false,
         autoIncrement:true,
         primaryKey: true,
       },
       product_name:{
        type:DataTypes.STRING,
        allowNull:false

       },
       product_id:{
        type:DataTypes.STRING,
        allowNull:false
       },
       category:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Category',
          key: 'category_sno',
        }, 
       },
       user:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
          model:'User',
          key:'user_sno'
        },
       }
       
      };
      const options = {
        sequelize,
        modelName: "Product",
        freezeTableName: true,
        timestamps: false,
      };

      const Product = sequelize.define("Product", attributes, options);

      return Product;
}
module.exports = productModel;
