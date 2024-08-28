const router = require('express').Router();
const { Login, About, Contact, Members, BookApp, ViewApp } = require('../controller/LoginP');

router.get('/login', Login);
router.post('/login', Login);
router.get('/About', About);
router.get('/Contact', Contact);
router.get('/Members', Members);
router.get('/BookApp', BookApp);
router.get('/ViewApp', ViewApp);

module.exports = router;