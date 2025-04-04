const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const {login} = require('../controllers/loginController')
const {authenticate }= require('../middlewares/authMiddleware');
const { checkAbility } = require('../middlewares/abilityMiddleware');

router.use(authenticate);

router.post('/login', login);
router.post('/', checkAbility('create','Article'), articleController.createArticle);
router.get('/getall',checkAbility('read','Article'), articleController.getArticles);
router.put('/:id', checkAbility('update','Article'),articleController.updateArticle);
router.delete('/:id', checkAbility('delete','Article'),articleController.deleteArticle);

module.exports = router;
