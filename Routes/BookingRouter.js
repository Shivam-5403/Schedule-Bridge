const express = require('express');
const router = express.Router();
const { appointment, Update, fetch_admins, contactUs_req, book_appointment,
    search_business, search_appointment, search_appointment2, view_appointments,
    cancel_appointment, logout } = require('../Controller/BookingController');

router.get('/search-business', search_business);
router.get('/search-appointment', search_appointment);
router.get('/search-appointment2', search_appointment2);
router.get('/view-appointments', view_appointments);
router.get('/appointments', appointment);
router.put('/cancel-appointment/:id', cancel_appointment);
router.get('/logout', logout);

router.post('/Info', fetch_admins);
router.post('/update-appointment', Update);
router.post('/book-appointment', book_appointment);
router.post('/contactUs-req', contactUs_req);

module.exports = router;
