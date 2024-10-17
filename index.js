const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { sessionChecker } = require('./Middleware/session');
const userRouter = require('./Routes/UserRouter');  // Import UserRouter
const adminRouter = require('./Routes/AdminRouter'); // Import AdminRouter
const bookingRouter = require('./Routes/BookingRouter'); // Import BookingRouter

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname));
app.use(express.static('public'));
app.use(express.static(__dirname + '/Pages'));

app.use(
    session({
        name: 'user-session',
        secret: 'YourSecretKey',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 30 * 60 * 1000 }, // 30 mins session
    })
);

app.use(cookieParser());

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

app.use('/', adminRouter);
app.use('/', bookingRouter);
// app.use(loginRequired);
app.use(sessionChecker);
app.use('/', userRouter);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
