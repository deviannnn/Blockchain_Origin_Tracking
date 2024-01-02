const isLogged = (req, res, next) => {
    const current = req.session.account;
    if (current) {
        res.locals.account = current;
        return next();
    }
    return res.redirect('/login');
}

const isFarmer = (req, res, next) => {
    const current = req.session.account;
    if (current && current.role === 'farmer') {
        res.locals.account = current;
        return next();
    }
    return res.redirect('/');
}

const isCompany = (req, res, next) => {
    const current = req.session.account;
    if (current && current.role === 'company') {
        res.locals.account = current;
        return next();
    }
    return res.redirect('/');
}

module.exports = { isLogged, isFarmer, isCompany }