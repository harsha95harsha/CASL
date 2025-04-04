
const {defineAbilitiesFor} = require('../abilities/defineAbilities');
const db = require('../config/db');


async function createCategory(req, res) {
  try {
    const ability = await defineAbilitiesFor(req.user);

    if (!ability.can('create', 'Category')) {
      return res.status(403).json({
        message: 'You do not have permission to create a category.',
      });
    }

    const { category_name} = req.body;
    const user = req.user.user_sno;
    const category = await db.Category.create({ category_name, user });
    res.status(201).json({
      message: 'Category has been created successfully',
      category: category,
    });
  } catch (error) {
    console.log(error); // This helps log the full error object in the console
      res.status(500).json({
      message: 'Failed to create Category',
      error: error.message || 'An unknown error occurred',
      details: error.errors || {},
  });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await db.Category.findAll();
 

    // Define abilities with dynamic subjects
    const ability = await defineAbilitiesFor(req.user);
    

    if (!ability.can('read', 'Category')) {
      return res.status(403).json({
        message: "You do not have permission to view categories.",
      });
    }
    
    res.json({
      message: "Categories retrieved successfully",
      categories:categories,
    });
  } catch (error) {
    console.log(error); // This helps log the full error object in the console
      res.status(500).json({
      message: 'Failed to retrive Categories',
      error: error.message || 'An unknown error occurred',
      details: error.errors || {},
  });
    
  }
}

async function updateCategory(req, res) {
  try {
    const category_sno = req.params.id;
    const category = await db.Category.findByPk(category_sno);

    if (!category) {
      return res.status(404).json({
        success:false,
        statusCode:404,
        message: "Category not found" });
    }

    const ability = await defineAbilitiesFor(req.user);
 
  
    const user = req.user.user_sno;
    
    console.log('The creator of the category is: ', user);
    console.log('The category_sno of the fetched category to be updated is: ',category_sno);


    if (!ability.can('update', category)) {
      return res.status(403).json({
        message: 'You do not have permission to update this category.',
      });
    }

    const {  } = req.body;

    // Proceed with update if permission is granted
    const updatedCategory = await category.update({
    
    });
    return res.json({
      message: 'Category updated successfully',
      updatedCategory: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update category',
      error: error.message || 'An unknown error occurred',
      details: error.errors || {},
    });
  }
}

async function deleteCategory(req, res) {
  try {
    const category_sno = req.params.id;
    const category = await db.Category.findByPk(category_sno);

    if (!category) {
      return res.status(404).json({
        success:false,
        statusCode:404,
        message: "Category not found" });
    }

    // Define abilities based on the current user
    const ability = await defineAbilitiesFor(req.user);

    // Check if user has permission to delete this article
    if (!ability.can('delete', category)) {
      return res.status(403).json({
        message: 'You do not have permission to delete this category.',
      });
    }

    // Proceed with deletion if permission is granted
    await category.destroy();
    return res.json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete category',
      error: error.message || 'An unknown error occurred',
      details: error.errors || {},
    });
  }
}

module.exports = { createCategory, getCategories, updateCategory,deleteCategory };
