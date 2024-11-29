const { UserController } = require("../controller")
const { createUserValidator, updateOrDeletUserValidator } = require("../middelware/validator")

const router = require("express").Router()

router.route("/")
    .get(UserController.findAll)
    .post(createUserValidator, UserController.create)

router.route("/:id")
    .get(UserController.findById)
    .put(updateOrDeletUserValidator, UserController.update)
    .delete(updateOrDeletUserValidator, UserController.remove)

router.post("/login", UserController.login)

module.exports = router