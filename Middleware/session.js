const INACTIVE_LIMIT = 0.5 * 60 * 1000; // 30 seconds

const sessionChecker = (req, res, next) => {
    const now = Date.now();

    if (req.session && req.session.lastActive) {
        const inactiveTime = now - req.session.lastActive;

        if (inactiveTime > INACTIVE_LIMIT) {
            const adminId = req.session.admin;
            const userId = req.session.name;

            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return res.status(500).send('Error logging out.');
                }

                if (adminId) {
                    res.clearCookie('adminId_', { path: '/admin_login' });
                    console.log(`Session expired for admin: ${adminId}`);
                }
                if (userId) {
                    res.clearCookie('userId_', { path: '/' });
                    console.log(`Session expired for user: ${userId}`);
                }
                res.clearCookie('connect.sid', { path: '/' });

                return res.redirect('/?timeout=true');
            });
        } else {
            req.session.lastActive = now;
            next();
        }
    } else {
        next();
    }
};

const loginRequired = (req, res, next) => {
    if (!req.session.name) {
        return res.redirect('/?error=Please%20login%20first.');
    }
    next();
};

module.exports = { sessionChecker, loginRequired };
