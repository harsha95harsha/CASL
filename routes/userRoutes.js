const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authenticate }= require('../middlewares/authMiddleware');
const { checkAbility } = require('../middlewares/abilityMiddleware');

router.use(authenticate);
router.post('/', checkAbility('create','User'),userController.createUser);
router.get('/getall', checkAbility('read','User'),userController.getAllUsers);
router.put('/:id',checkAbility('update','User'), userController.updateUser);
router.put('/permissions/:id', checkAbility('update', 'Permission'), userController.updatePermissions);
router.delete('/:id', checkAbility('delete','User'), userController.deleteUser);
module.exports = router;