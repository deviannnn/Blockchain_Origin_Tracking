
const loginView = (req, res) => {
    res.render('login', { layout: null });
}

const registerView = (req, res) => {
    res.render('register', { layout: null });
}

const homeView = (req, res) => {
    res.render('home', { active: 'home', role: req.session.account.role });
}

const inventoryView = (req, res) => {
    res.render('inventory', { isFarmer: req.session.account.role === 'farmer', 
    script: 'inventory', active: 'inventory', 
    username: JSON.stringify(req.session.account), 
    role: req.session.account.role});
}

const purchaseView = (req, res) => {
    res.render('purchase-asset', { script: 'purchase-asset', active: 'purchase', role: req.session.account.role });
}

module.exports = { loginView, registerView, homeView, inventoryView, purchaseView };