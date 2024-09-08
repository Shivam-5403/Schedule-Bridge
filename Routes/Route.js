const router = require('express').Router();
const { Home, fetch_admins, Update, About, Contact, Members, BookApp, ViewApp, appointment, User_Profile, Admin_Home, Admin_About, Admin_Contact, Admin_Members, Admin_Profile } = require('../controller/LoginP');

router.get('/Home', Home);
router.post('/update-appointment', Update);
router.get('/appointments', appointment);
router.post('/Info', fetch_admins);
router.get('/About', About);
router.get('/Contact', Contact);
router.get('/Members', Members);
router.get('/Admin_Home',Admin_Home);
router.get('/Admin_About', Admin_About);
router.get('/Admin_Contact', Admin_Contact);
router.get('/Admin-Profile', Admin_Profile);
router.get('/Admin_Members', Admin_Members);
router.get('/BookApp', BookApp);
router.get('/ViewApp', ViewApp);
router.get('/User-Profile', User_Profile);

module.exports = router;