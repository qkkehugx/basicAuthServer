const router = require('express').Router();
const {
  login,
  register,
} = require('../controller/index');

router.post('/register', register);
router.post('/login', login);

module.exports = router;