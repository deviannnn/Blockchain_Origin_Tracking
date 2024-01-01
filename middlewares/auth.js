const isLogged = (req, res, next) => {
    if (req.session.account) {
        return next();
    }
    return res.redirect('/login');
}

const isFarmer = (req, res, next) => {
    const current = req.session.account;
    if (current && current.role === 'farmer') {
        return next();
    }
    return res.redirect('/');
}

module.exports = { isLogged, isFarmer }