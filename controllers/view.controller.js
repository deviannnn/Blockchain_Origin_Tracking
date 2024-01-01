
const loginView = (req, res) => {
    res.render('login', { layout: null });
}

const registerView = (req, res) => {
    res.render('register', { layout: null });
}

const homeView = (req, res) => {
    res.render('home');
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
    res.render('inventory');
}

const purchaseView = (req, res) => {
    res.render('purchase-asset');
}

module.exports = { loginView, registerView, homeView, handleView, inventoryView, purchaseView };