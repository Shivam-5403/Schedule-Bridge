const router = require('express').Router();
const { Home, fetch_admins, Update, About, Contact, Members, BookApp, ViewApp, pending, User_Profile } = require('../controller/LoginP');

router.get('/Home', Home);
router.post('/update-appointment', Update);
router.get('/appointments', pending);
router.post('/Info', fetch_admins);
router.get('/About', About);
router.get('/Contact', Contact);
router.get('/Members', Members);
router.get('/BookApp', BookApp);
router.get('/ViewApp', ViewApp);
router.get('/User-Profile', User_Profile);

module.exports = router;