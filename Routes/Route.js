const router = require('express').Router();
const { Home, fetch_admins, pending, About, Contact, Members, BookApp, ViewApp } = require('../controller/LoginP');

router.get('/Home', Home);
router.get('/pending', pending);
router.post('/Info', fetch_admins);
router.get('/About', About);
router.get('/Contact', Contact);
router.get('/Members', Members);
router.get('/BookApp', BookApp);
router.get('/ViewApp', ViewApp);

module.exports = router;