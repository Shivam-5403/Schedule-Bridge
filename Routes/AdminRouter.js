const express = require('express');
const router = express.Router();
const {
    admin, adminG_signup, forgot_admin_password, adminG_changepassword,
    adminG_verification, view_admin_profile, Admin_About, Admin_Contact,
    Admin_Home, Admin_Members, Admin_Profile, admin_login,
    adminP_changepassword, adminP_signup, adminP_verification,
    change_admin_prof, change_pass_admin
} = require('../Controller/AdminController');

router.get('/admin', admin);
router.get('/admin_signup', adminG_signup);
router.get('/admin_verification', adminG_verification);
router.get('/admin_changepassword', adminG_changepassword);
router.get('/forgot-admin-password', forgot_admin_password);
router.post('/admin_login', admin_login);
router.post('/admin_signup', adminP_signup);
router.post('/admin_changepassword', adminP_changepassword);
router.post('/admin_verification', adminP_verification);

router.get('/Admin-Profile', Admin_Profile);
router.get('/Admin_Home', Admin_Home);
router.get('/Admin_About', Admin_About);
router.get('/Admin_Contact', Admin_Contact);
router.get('/Admin_Members', Admin_Members);
router.get('/view-admin-profile', view_admin_profile);

router.post('/change-admin-prof', change_admin_prof);
router.post('/change-pass-admin', change_pass_admin);

module.exports = router;
