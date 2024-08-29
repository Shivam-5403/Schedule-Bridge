const { Login, G_signup, admin, adminG_signup, forgot_password, forgot_admin_password, adminG_verification, adminG_changepassword, G_verification, search_business } = require('../controller/GetRoute');
const { login, logout, admin_login, P_signup, adminP_signup, adminP_verification, adminP_changepassword, P_verification, P_changepassword, book_appointment } = require('../controller/PostRoute');
const router = require('express').Router();

router.get('/', Login);
router.get('/signup', G_signup);
router.get('/admin', admin);
router.get('/admin_signup', adminG_signup);
router.get('/forgot-admin-password', forgot_admin_password);
router.get('/admin_changepassword', adminG_changepassword);
router.get('/admin_verification', adminG_verification);
router.get('/forgot-password', forgot_password);
router.get('/verification', G_verification);
router.get('/search-business', search_business);

router.post('/Home', login);
router.post('/logout', logout);
router.post('/signup', P_signup);
router.post('/admin_login', admin_login);
router.post('/admin_signup', adminP_signup);
router.post('/admin_changepassword', adminP_changepassword);
router.post('/admin_verification', adminP_verification);
router.post('/verification', P_verification);
router.post('/changepassword', P_changepassword);
router.post('/book-appointment', book_appointment);

module.exports = router;