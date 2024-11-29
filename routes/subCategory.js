const { SubCategoryController } = require("../controller")
const checkAuthrizationCompany = require("../middelware/authenticator")
const { getByIdValidator, createSubCategoryValidator, updateOrDeletSubCategoryValidator } = require("../middelware/validator")

const router = require("express").Router()

router.route("/")
    .get(SubCategoryController.findAll)
    .post(createSubCategoryValidator, checkAuthrizationCompany, SubCategoryController.create)

router.route("/:id")
    .get(getByIdValidator, SubCategoryController.findById)
    .put(updateOrDeletSubCategoryValidator, checkAuthrizationCompany, SubCategoryController.update)
    .delete(updateOrDeletSubCategoryValidator, checkAuthrizationCompany, SubCategoryController.remove)

router.route("/category/:categoryId")
    .get(SubCategoryController.findAllByOneCategory)


module.exports = router