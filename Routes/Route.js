const router = require('express').Router();
const { Home, Info, About, Contact, Members, BookApp, ViewApp } = require('../controller/LoginP');

router.get('/Home', Home);
router.post('/login', Info);
router.get('/About', About);
router.get('/Contact', Contact);
router.get('/Members', Members);
router.get('/BookApp', BookApp);
router.get('/ViewApp', ViewApp);

module.exports = router;