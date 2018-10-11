const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (UserSchema) => {

    // Post save middleware
    UserSchema.pre('save', function (next) {

        // console.log('UserSchema pre save hook called');

        // Get user
        let user = this;

        // Password modified
        if (user.isModified('password')) {

            // Hash the password
            bcrypt.genSalt(10, (err, salt) => {

                    // Error?
                if (err) return next(errors.ENCRYPTION_FAILED);

                bcrypt.hash(user.password, salt, (err2, hash) => {

                    // Error?
                    if (err2) return next(errors.ENCRYPTION_FAILED);

                    // Set new password as hashed
                    user.password = hash;
                    next();

                });
            });

        }
        // Password not modified
        else {
            next();
        }

    });
    
}