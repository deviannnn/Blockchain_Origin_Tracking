
const loginView = (req, res) => {
    res.render('login', { layout: null });
}

const registerView = (req, res) => {
    res.render('register', { layout: null });
}

const homeView = (req, res) => {
    res.render('home', { active: 'home' });
}

const handleView = (req, res) => {
    const source = req.query.source;
    if (source === 'edit') {
        const assetID = req.query.id;
        res.render('edit-asset');
    }
    res.render('handle-asset');
}

const inventoryView = (req, res) => {
    res.render('inventory', { script: 'inventory', active: 'inventory' });
}

const purchaseView = (req, res) => {
    res.render('purchase-asset', { script: 'purchase-asset', active: 'purchase' });
}

module.exports = { loginView, registerView, homeView, handleView, inventoryView, purchaseView };