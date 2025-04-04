require("dotenv").config();
const express = require('express');

const articleRoutes = require('./routes/articleRoutes');
const userRoutes = require('./routes/userRoutes');
const assetRoutes = require('./routes/assetRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const loginRoutes = require('./routes/authRoutes');
const bodyParser = require("body-parser");
require('./config/db'); // Connect to the database

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT,PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use('/articles', articleRoutes);
app.use('/users', userRoutes);
app.use('/assets', assetRoutes);
app.use('/products', productRoutes);
app.use('/category', categoryRoutes);


app.use('/', loginRoutes) 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
