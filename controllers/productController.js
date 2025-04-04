
const {defineAbilitiesFor} = require('../abilities/defineAbilities');
const db = require('../config/db');


async function createProduct(req, res) {
  try {
    const ability = await defineAbilitiesFor(req.user);

    if (!ability.can('create', 'Product')) {
      return res.status(403).json({
        message: 'You do not have permission to create an article.',
      });
    }

    const { product_name} = req.body;
    const user = req.user.user_sno;
    const product = await db.Product.create({ product_name, user });
    res.status(201).json({
      message: 'Product has been created successfully',
      product: product,
    });
  } catch (error) {
    console.log(error); // This helps log the full error object in the console
      res.status(500).json({
      message: 'Failed to create Product',
      error: error.message || 'An unknown error occurred',
      details: error.errors || {},
  });
  }
}

async function getProducts(req, res) {
  try {
    const products = await db.Product.findAll();
 

    // Define abilities with dynamic subjects
    const ability = await defineAbilitiesFor(req.user);
    

    if (!ability.can('read', 'Product')) {
      return res.status(403).json({
        message: "You do not have permission to view products.",
      });
    }
    
    res.json({
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    console.log(error); // This helps log the full error object in the console
      res.status(500).json({
      message: 'Failed to retrive Product',
      error: error.message || 'An unknown error occurred',
      details: error.errors || {},
  });
    
  }
}

async function updateProduct(req, res) {
  try {
    const product_sno = req.params.id;
    const product = await db.Product.findByPk(product_sno);

    if (!product) {
      return res.status(404).json({
        success:false,
        statusCode:404,
        message: "Product not found" });
    }

    const ability = await defineAbilitiesFor(req.user);
 
  
    const user = req.user.user_sno;
    
    console.log('The creator of the product is: ', user);
    console.log('The product_sno of the fetched product to be updated is: ', product_sno);


    if (!ability.can('update', product)) {
      return res.status(403).json({
        message: 'You do not have permission to update this product.',
      });
    }

    const {  } = req.body;

    // Proceed with update if permission is granted
    const updatedProduct = await product.update({
    
    });
    return res.json({
      message: 'Product updated successfully',
      updatedProduct: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update product',
      error: error.message || 'An unknown error occurred',
      details: error.errors || {},
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const product_sno = req.params.id;
    const product = await db.Product.findByPk(product_sno);

    if (!product) {
      return res.status(404).json({
        success:false,
        statusCode:404,
        message: "Product not found" });
    }

    // Define abilities based on the current user
    const ability = await defineAbilitiesFor(req.user);

    // Check if user has permission to delete this article
    if (!ability.can('delete', product)) {
      return res.status(403).json({
        message: 'You do not have permission to delete this product.',
      });
    }

    // Proceed with deletion if permission is granted
    await product.destroy();
    return res.json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete product',
      error: error.message || 'An unknown error occurred',
      details: error.errors || {},
    });
  }
}

module.exports = { createProduct, getProducts, updateProduct,deleteProduct };
