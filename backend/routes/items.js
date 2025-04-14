const express = require('express');
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getItemsByStatus,
  getMyItems,
  addLocationNotification
} = require('../controllers/items');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getItems)
  .post(protect, createItem);

router.route('/:id')
  .get(getItem)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

router.route('/status/:status')
  .get(getItemsByStatus);

router.route('/user/me')
  .get(protect, getMyItems);

router.route('/:id/notifications')
  .post(protect, addLocationNotification);

module.exports = router;
