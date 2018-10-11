const mongoose = require('mongoose');

let RefreshTokenSchema = new mongoose.Schema({
    _userId: {
        index: true,
        ref: 'User',
        required: true,
        type: mongoose.Schema.Types.ObjectId
    },
    token: {
        index: true,
        required: true,
        type: String
    }
}, { timestamps: true });

// Create model
var RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);

// Export model
module.exports = { RefreshToken };
