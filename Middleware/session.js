const INACTIVE_LIMIT = 0.5 * 60 * 1000;

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
                    res.clearCookie('adminId_', { path: '/' });
                    console.log(`Session expired. Cleared cookie for admin: ${adminId}`);
                }
                if (userId) {
                    res.clearCookie('userId_', { path: '/' });
                    console.log(`Session expired. Cleared cookie for user: ${userId}`);
                }

                res.clearCookie('connect.sid', { path: '/' });

                return res.redirect('/?error=Session%20expired%2C%20please%20log%20in%20again.');
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
