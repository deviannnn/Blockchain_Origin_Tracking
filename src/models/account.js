const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    gmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    assets: [{ type: String, required: true }],
    role: { type: String, required: true, enum: ['farmer', 'company'] },
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;