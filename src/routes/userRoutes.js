const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const {addUsers, sendEmailToList} = require('../controllers/userController');

router.post('/lists/:listId/users', upload.single('file'), addUsers);
router.post('/lists/:listId/send-email', sendEmailToList);

module.exports = router;
