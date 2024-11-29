const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendForDev(err, res)
    } else {
        sendForProd(err, res)
    }
}

const sendForDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        msg: err.msg,
        stack: err.stack
    })
}

const sendForProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            msg: err.message
        })
    } else {
        res.status(500).json({
            status: "error",
            msg: "Something went wrong"
        })
    }
}

module.exports = globalError