const router = require('express').Router();
const { getUser, updateUser } = require('../controllers/users');
const { validationGetUser } = require('../middlewares/validations');

router.get('/me', validationGetUser, getUser);
router.patch('/me', updateUser);

module.exports = router;
