const express = require('express');

const userController = require('./../controllers/userController');
const { getAllUsers, addUser, getUserById, updateUser, deleteUser } =
  userController;

const router = express.Router();
router.route('/').get(getAllUsers).post(addUser);
router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = router;
