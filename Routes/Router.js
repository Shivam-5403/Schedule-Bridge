const { Login, G_signup, admin, adminG_signup, forgot_password, forgot_admin_password, adminG_verification, adminG_changepassword, G_verification, search_business, search_appointment, search_appointment2, view_appointments, cancel_appointment, logout, view_profile } = require('../controller/GetRoute');
const { login, admin_login, P_signup, adminP_signup, adminP_verification, adminP_changepassword, P_verification, P_changepassword, book_appointment } = require('../controller/PostRoute');
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
router.get('/search-appointment', search_appointment);
router.get('/search-appointment2', search_appointment2);
router.get('/view-appointments', view_appointments);
router.put('/cancel-appointment/:id', cancel_appointment);
router.get('/logout', logout);
router.get('/view-profile', view_profile);

router.post('/Home', login);
router.post('/signup', P_signup);
router.post('/admin_login', admin_login);
router.post('/admin_signup', adminP_signup);
router.post('/admin_changepassword', adminP_changepassword);
router.post('/admin_verification', adminP_verification);
router.post('/verification', P_verification);
router.post('/changepassword', P_changepassword);
router.post('/book-appointment', book_appointment);

module.exports = router;