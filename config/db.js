const { Sequelize } = require('sequelize');
const User = require('../models/userModel');
const Article = require('../models/articleModel');
const Asset = require('../models/assetModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Permissions = require('../models/permissionsModel');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  post:process.env.PSQL_PORT,

  dialect: process.env.DIALECT,
  record:process.env.RECORD,
  logging: console.log,
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

// Test the connection
testConnection();

const db = {};
db.Article = Article(sequelize);
db.User = User(sequelize);
db.Asset = Asset(sequelize);
db.Product = Product(sequelize);
db.Category  = Category(sequelize);
db.Permissions = Permissions(sequelize);
db.sequelize = sequelize;

db.User.hasMany(db.Article, {
  foreignKey: 'author_id',
  as: 'articles',
});

db.Article.belongsTo(db.User, {
  foreignKey: 'author_id',
  as: 'author',
});

db.Asset.belongsTo(db.Product, {foreignKey:'product'});
db.Product.hasOne(db.Asset, {foreignKey:'product'});

db.Product.belongsTo(db.Category, {foreignKey:'category'});
db.Category.hasMany(db.Product, {foreignKey:'category'});

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((error) => {
    console.error("Unable to sync models with the database:", error);
    process.exit(1);
  });

module.exports = db;
