const router = require('express').Router();
const { Home, fetch_admins, Update, About, Contact, Members, BookApp, ViewApp, pending } = require('../controller/LoginP');

router.get('/Home', Home);
router.post('/update-appointment', Update);
router.get('/appointments', pending);
router.post('/Info', fetch_admins);
router.get('/About', About);
router.get('/Contact', Contact);
router.get('/Members', Members);
router.get('/BookApp', BookApp);
router.get('/ViewApp', ViewApp);

module.exports = router;