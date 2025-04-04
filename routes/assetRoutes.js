const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

const {authenticate }= require('../middlewares/authMiddleware');
const { checkAbility } = require('../middlewares/abilityMiddleware');

router.use(authenticate);


router.post('/', checkAbility('create','Asset'), assetController.createAsset);
// router.get('/getall',checkAbility('read','Article'), articleContro);
// router.put('/:id', checkAbility('update','Article'),articleController.updateArticle);
// router.delete('/:id', checkAbility('delete','Article'),articleController.deleteArticle);

module.exports = router;