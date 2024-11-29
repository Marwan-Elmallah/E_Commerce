const ApiError = require("../utils/apiErrors");
const TokenManager = require("../utils/jwt");

const checkAuthrizationCompany = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            error: true,
            message: 'No Authorization Provided',
            code: 401,
        });
    }
    const decode = await TokenManager.compareToken(authorization);
    if (decode.role != "company") {
        return next(new ApiError("Unauthorized", 401));
    }
    req.userId = decode.id
    next()
}

module.exports = checkAuthrizationCompany