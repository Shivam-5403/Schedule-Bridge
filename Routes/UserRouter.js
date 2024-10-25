const express = require('express');
const router = express.Router();
const path = require('path');
const Authenticate = require('../Middleware/Authenticate');
const {
    Home, About, Contact, Members, User_Profile, Login, G_signup,
    forgot_password, G_verification, view_profile, BookApp, ViewApp,
    login, P_signup, P_changepassword, P_verification,
    change_pass, change_prof
} = require('../Controller/UserController');

router.get('/', async (req, res, next) => {
    console.log(req.cookies.UserId_)
    if (req.cookies.UserId_) {
        return res.sendFile(path.join(__dirname, '../Pages/User-Home.html'));
    }
    else
        next()
}, Login);
router.get('/signup', G_signup);
router.get('/forgot-password', forgot_password);
router.get('/verification', G_verification);
router.post('/Home', login);
router.post('/signup', P_signup);
router.post('/verification', P_verification);
router.post('/changepassword', P_changepassword);

router.use(Authenticate);

router.get('/User-Profile', User_Profile);
router.get('/view-profile', view_profile);
router.post('/change-pass', change_pass);
router.post('/change-prof', change_prof);
router.get('/Home', Home);
router.get('/About', About);
router.get('/Contact', Contact);
router.get('/Members', Members);
router.get('/BookApp', BookApp);
router.get('/ViewApp', ViewApp);

module.exports = router;
