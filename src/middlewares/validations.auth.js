const { body, validationResult } = require("express-validator");

const validationsResult = {
    registerValidation: [
        body('user_name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
        body('user_email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Invalid email format')
            .normalizeEmail(),
        body('user_password')
            .trim()
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ]
}

module.exports = validationsResult;