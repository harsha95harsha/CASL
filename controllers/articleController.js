
const {defineAbilitiesFor} = require('../abilities/defineAbilities');
const db = require('../config/db');


async function createArticle(req, res) {
  try {
    const ability = await defineAbilitiesFor(req.user);

    if (!ability.can('create', 'Article')) {
      return res.status(403).json({
        message: 'You do not have permission to create an article.',
      });
    }

    const { title, content} = req.body;
    const author_id = req.user.user_sno;
    const article = await db.Article.create({ title, content, author_id });
    res.status(201).json({
      message: 'Article has been created successfully',
      article: article,
    });
  } catch (error) {
    console.log(error); // This helps log the full error object in the console
      res.status(500).json({
      message: 'Failed to create Article',
      error: error.message || 'An unknown error occurred',
      details: error.errors || {},
  });
  }
}

async function getArticles(req, res) {
  try {
    const articles = await db.Article.findAll();
 

    // Define abilities with dynamic subjects
    const ability = await defineAbilitiesFor(req.user);
    

    if (!ability.can('read', 'Article')) {
      return res.status(403).json({
        message: "You do not have permission to view articles.",
      });
    }
    
    res.json({
      message: "Articles retrieved successfully",
      articles,
    });
  } catch (error) {
    console.log(error); // This helps log the full error object in the console
      res.status(500).json({
      message: 'Failed to retrive Article',
      error: error.message || 'An unknown error occurred',
      details: error.errors || {},
  });
    
  }
}

async function updateArticle(req, res) {
  const transaction = await db.sequelize.transaction(); // Start a transaction
  try {
    const article_sno = req.params.id;
    const article = await db.Article.findByPk(article_sno, {
      attributes: ['article_sno', 'title', 'content', 'author_id'],
    });
    console.log('The article to be updated is: ', article);

    if (!article) {
      return res.status(404).json({
        success:false,
        statusCode:404,
        message: "Article not found" });
    }


    const ability = await defineAbilitiesFor(req.user);
 
  
    const author_id = req.user.user_sno;
    
    console.log('The author_id of the article is: ', author_id);
    console.log('The article_sno of the fetched article to be updated is: ', article_sno);


    if (!ability.can('update', article)) {
      return res.status(403).json({
        message: 'You do not have permission to update this article.',
      });
    }

    const { title, content } = req.body;

    // Proceed with update if permission is granted
    const updatedArticle = await article.update({
      title,
      content,
    });

      // Commit the transaction
      await transaction.commit();

    return res.status(200).json({
      message: 'Article updated successfully',
      updatedArticle: updatedArticle,
    });
  } catch (error) {
     // Rollback the transaction in case of an error
     await transaction.rollback();

    res.status(500).json({
      message: 'Failed to update article',
      error: error.message || 'An unknown error occurred',
      details: error.errors || {},
    });
  }
}

async function deleteArticle(req, res) {
  try {
    const article_sno = req.params.id;
    const article = await db.Article.findByPk(article_sno);

    if (!article) {
      return res.status(404).json({
        success:false,
        statusCode:404,
        message: "Article not found" });
    }

    // Define abilities based on the current user
    const ability = await defineAbilitiesFor(req.user);

    // Check if user has permission to delete this article
    if (!ability.can('delete', article)) {
      return res.status(403).json({
        message: 'You do not have permission to delete this article.',
      });
    }

    // Proceed with deletion if permission is granted
    await article.destroy();
    return res.json({
      message: 'Article deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete article',
      error: error.message || 'An unknown error occurred',
      details: error.errors || {},
    });
  }
}

module.exports = { createArticle, getArticles, updateArticle,deleteArticle };
