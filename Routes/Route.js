const router = require('express').Router();
const { Login, About, Contact, Members } = require('../controller/LoginP');

router.get('/login', Login);
router.get('/About', About);
router.get('/Contact', Contact);
router.get('/Members', Members);

module.exports = router;