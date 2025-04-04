const { DataTypes } = require('sequelize');





function articleModel (sequelize) {
  const attributes = {
        article_sno:{
         type:DataTypes.INTEGER,
         allowNull: false,
         autoIncrement:true,
         primaryKey: true,
       },
        title: {
          type: DataTypes.STRING,
         allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        author_id: {
          type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                  model: 'User',
                  key: 'user_sno',
                },
              }
      };
      const options = {
        sequelize,
        modelName: "Article",
        freezeTableName: true,
        timestamps: false,
      };

      const Article = sequelize.define("Article", attributes, options);

      return Article;
}
module.exports = articleModel;
//   return sequelize.define('Article', {
//     article_id: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       primaryKey: true,
//     },
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     content: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     author_id: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       references: {
//         model: 'User',
//         key: 'user_id',
//       },
//     },
//   }, {
//     tableName: 'Article',
//     freezeTableName: true,
//     timestamps: false,
//   });

// }
// module.exports = articleModel;

// const { DataTypes } = require('sequelize');

// module.exports = (sequelize) => {
//   const Article = sequelize.define("Article", {
//     article_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     content: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     author_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//   }, {
//     freezeTableName: true,
//     timestamps: false,
//   });

//   return Article;
// };
