const { validationResult, check } = require("express-validator");
const ApiError = require("../utils/apiErrors");

const validator = (allowedKeys) => (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).send({ error: error.array()[0] });
    }

    // Check for unexpected keys
    const bodyKeys = Object.keys(req.body);
    const unexpectedKeys = bodyKeys.filter(key => !allowedKeys.includes(key));

    if (unexpectedKeys.length > 0) {
        return res.status(400).send({
            errors: unexpectedKeys.map(key => ({
                msg: `Unexpected key: ${key}`,
                param: key
            }))
        });
    }

    next();
};

const getByIdValidator = [
    check("id").isMongoId().withMessage("Invalid Id"),
    validator(["id"])
];

const createCategoryValidator = [
    check("name").notEmpty().withMessage("Category name is required")
        .isLength({ min: 3 }).withMessage("Too short category name")
        .isLength({ max: 32 }).withMessage("Too long category name"),
    validator(["name"])
];

const updateOrDeletUserValidator = [
    check("id").isMongoId().withMessage("Invalid Id"),
    check("firstname").optional().isString().withMessage("Invalid firstname"),
    check("lastname").optional().isString().withMessage("Invalid lastname"),
    validator(["id", "firstname", "lastname"])
];

const updateOrDeletSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid Id"),
    check("name").optional().isString()
        .isLength({ min: 3 }).withMessage("Too short category name")
        .isLength({ max: 32 }).withMessage("Too long category name"),
    check("category").optional().isMongoId().withMessage("Invalid Id"),
    validator(["id", "name", "category"])
];

const updateOrDeletCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid Id"),
    check("name").optional().isString()
        .isLength({ min: 3 }).withMessage("Too short category name")
        .isLength({ max: 32 }).withMessage("Too long category name"),
    validator(["id", "name"])
];

const updateOrDeletBrandValidator = [
    check("id").isMongoId().withMessage("Invalid Id"),
    check("name").optional().isString()
        .isLength({ min: 3 }).withMessage("Too short category name")
        .isLength({ max: 32 }).withMessage("Too long category name"),
    validator(["id", "name"])
];

const updateOrDeletProductValidator = [
    check("id").isMongoId().withMessage("Invalid Id"),
    check("title").optional().isString()
        .isLength({ min: 3 }).withMessage("Too short category name")
        .isLength({ max: 32 }).withMessage("Too long category name"),
    check("description").optional().isString()
        .isLength({ min: 20 }).withMessage("Too short category Description"),
    check("price").optional().isNumeric(),
    check("priceAfterDiscount").optional().isNumeric(),
    check("quantity").optional().isNumeric(),
    check("averageRating").optional().isNumeric(),
    check("category").optional().isMongoId().withMessage("Invalid category Id"),
    check("subCategory").optional().isMongoId().withMessage("Invalid subCategory Id"),
    check("brand").optional().isMongoId().withMessage("Invalid brand Id"),
    check("colors").optional().isArray().withMessage("Invalid colors"),
    check("images").optional().isArray().withMessage("Invalid images"),
    validator(["id", "title", "description", "price", "priceAfterDiscount", "quantity", "averageRating", "category", "subCategory", "brand", "colors", "images"])
];

const createSubCategoryValidator = [
    check("name").notEmpty().withMessage("Category name is required")
        .isLength({ min: 2 }).withMessage("Too short category name")
        .isLength({ max: 32 }).withMessage("Too long category name"),
    check("category").isMongoId().withMessage("Invalid category Id"),
    validator(["name", "category"])
];

const createBrandValidator = [
    check("name").notEmpty().withMessage("Brand name is required")
        .isLength({ min: 2 }).withMessage("Too short brand name")
        .isLength({ max: 32 }).withMessage("Too long brand name"),
    validator(["name"])
];

const createProductValidator = [
    check("title").notEmpty().withMessage("Product name is required")
        .isLength({ min: 3 }).withMessage("Too short product name")
        .isLength({ max: 32 }).withMessage("Too long product name"),
    check("description").optional().isLength({ min: 20 }).withMessage("Too short product description")
        .isLength({ max: 2000 }).withMessage("Too long product description"),
    check("price").notEmpty().withMessage("Product price is required")
        .isNumeric().withMessage("Product price must be number"),
    check("priceAfterDiscount").optional().isNumeric().withMessage("Product priceAfterDiscount must be number")
        .custom((value, { req }) => {
            if (value >= req.body.price) {
                throw new ApiError("Product priceAfterDiscount must be less than product price", 502);
            }
            return true;
        }),
    check("category").notEmpty().withMessage("Product category is required")
        .isMongoId().withMessage("Invalid category Id"),
    check("colors").optional().isArray().withMessage("Invalid colors"),
    check("subCategory").optional().isArray().isMongoId().withMessage("Invalid subCategory Id"),
    check("brand").optional().isMongoId().withMessage("Invalid brand Id"),
    check("quantity").notEmpty().withMessage("Product quantity is required").isNumeric().withMessage("Product quantity must be number"),
    validator(["title", "description", "price", "priceAfterDiscount", "category", "colors", "subCategory", "brand", "quantity"])
];

const createUserValidator = [
    check("username").notEmpty().withMessage("username is required")
        .isLength({ min: 4 }).withMessage("too short username")
        .isLength({ max: 32 }).withMessage("too long username")
        .trim().toLowerCase(),
    check("firstName").optional().isString().withMessage("Invalid firstname"),
    check("lastName").optional().isString().withMessage("Invalid lastname"),
    check("email").isEmail().withMessage("invalid email").notEmpty().withMessage("email is required").trim().toLowerCase(),
    check("password").notEmpty().withMessage("password is required")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }).withMessage("password should contain at least one uppercase, one lowercase, one number, and one symbol"),
    check('rePassword').notEmpty().withMessage('rePassword is required')
        .custom((value, { req }) => {
            return value === req.body.password;
        }).withMessage("passwords don't match"),
    check("role").isIn(["client", "company"]).withMessage("role must be client or company"),
    validator(["username", "firstName", "lastName", "email", "password", "rePassword", "role"])
];

module.exports = {
    getByIdValidator,
    createCategoryValidator,
    updateOrDeletCategoryValidator,
    updateOrDeletBrandValidator,
    updateOrDeletProductValidator,
    updateOrDeletSubCategoryValidator,
    updateOrDeletUserValidator,
    createSubCategoryValidator,
    createBrandValidator,
    createProductValidator,
    createUserValidator
};
