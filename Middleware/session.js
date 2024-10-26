const INACTIVE_LIMIT = 0.5 * 60 * 1000;

const sessionChecker = (req, res, next) => {
    const now = Date.now();

    if (req.session && req.session.lastActive) {
        const inactiveTime = now - req.session.lastActive;

        if (inactiveTime > INACTIVE_LIMIT) {
            const adminId = req.cookies.AdminId_;
            const userId = req.cookies.UserId_;
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return res.status(500).send('Error logging out.');
                }

                if (adminId) {
                    res.clearCookie('AdminId_', { path: '/' });
                    console.log(`Session expired for admin: ${adminId}`);
                }
                if (userId) {
                    res.clearCookie('UserId_', { path: '/' });
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

module.exports = { sessionChecker };
