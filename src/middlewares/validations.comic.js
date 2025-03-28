const { body, validationResult } = require("express-validator");

const validationsResult = {
    authorValidations: [
        body('author_name')
            .trim()
            .notEmpty().withMessage('Author name is required')
            .isString().withMessage('Authorname must be a string')
            .isLength({ min: 3, max: 80 }).withMessage('Author name must be at least 3 characters long and 80 characters long'),
        body('author_bio')
            .trim()
            .notEmpty().withMessage('Bio is required')
            .isLength({ min: 50 }).withMessage('Bio must contain at least 50 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
}
    ],

    categoriesValidations: [
        body('category_name')
            .trim()
            .notEmpty().withMessage('Category is required')
            .isLength({ min: 3 }).whithMessage('Category must be at least 3 characters long')
            .isString().withMessage('Category must be a string'),
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