const mongoose = require('mongoose');
const validator = require('validator');

let UserSchema = new mongoose.Schema({
    deletedAt : {
        type: Date
    },
    email: {
        index: true,
        maxlength: 100,
        minlength: 1,
        sparse: true,
        trim: true,
        type: String,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    name: {
        maxlength: 30,
        minlength: 1,
        required: true,
        trim: true,
        type: String
    },
    password: {
        minlength: 1,
        required: true,
        type: String
    },
    surname: {
        maxlength: 30,
        minlength: 1,
        required: true,
        trim: true,
        type: String
    }
}, { timestamps: true });

// Associate methods
require("./methods/user")(UserSchema);

// Create model
var User = mongoose.model('User', UserSchema);

// Export model
module.exports = { User };
