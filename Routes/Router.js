const { Home, G_signup, admin, adminG_signup, forgot_password, forgot_admin_password, adminG_verification, adminG_changepassword, G_verification } = require('../controller/GetRoute');
const { login, logout, admin_login, P_signup, adminP_signup, adminP_verification, adminP_changepassword, P_verification, P_changepassword } = require('../controller/PostRoute');
const router = require('express').Router();

router.get('/', Home);
router.post('/login', login);
router.post('/logout', logout);
router.get('/signup', G_signup);
router.post('/signup', P_signup);
router.get('/admin', admin);
router.post('/admin_login', admin_login);
router.get('/admin_signup', adminG_signup);
router.post('/admin_login', adminP_signup);
router.get('/forgot-admin-password', forgot_admin_password);
router.get('/admin_changepassword', adminG_changepassword);
router.post('/admin_changepassword', adminP_changepassword);
router.get('/admin_verification', adminG_verification);
router.post('/admin_verification', adminP_verification);
router.get('/forgot-password', forgot_password);
router.get('/verification', G_verification);
router.post('/verification', P_verification);
router.post('/changepassword', P_changepassword);

module.exports = router;