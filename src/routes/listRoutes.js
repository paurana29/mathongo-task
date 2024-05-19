const express = require('express');
const router = express.Router();
const { createList } = require('../controllers/listController');

router.post('/lists', createList);

module.exports = router;

