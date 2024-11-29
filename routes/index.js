const router = require("express").Router()
const categoryRoutes = require("./category")
const subCategoryRoutes = require("./subCategory")
const brandRoutes = require("./brand")
const productRoutes = require("./product")
const userRoutes = require("./user")

router.use("/category", categoryRoutes)
router.use("/subCategory", subCategoryRoutes)
router.use("/brand", brandRoutes)
router.use("/product", productRoutes)
router.use("/user", userRoutes)

router.get("/", (req, res) => res.send("Ok"))

router.get("/status", (req, res) => {
    console.log(req.headers.host);
    res.json({
        message: `Server Is Up on ${req.headers.host}`,
        date: new Date()
    })
})

module.exports = router