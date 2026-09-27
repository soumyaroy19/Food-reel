const foodPartnerModel = require('../models/foodpartner.model')
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')

async function authFoodPartnerMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please Login First"
        })
    }

    try {
        const deocded = jwt.verify(token, process.env.JWT_SECRET)

        const foodPartner = await foodPartnerModel.findById(deocded.id);

        req.foodPartner = foodPartner;

        next()

    } catch (error) {
        return res.status(401).json({
            message: "Invalid Token"
        })
    }
}

async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "Please Login First"
        })
    }

    try {
        const deocded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(deocded.id);

        req.user = user;

        next()

    } catch (error) {
        return res.status(401).json({
            message: "Invalid Token"
        })
    }

}

module.exports = {
    authFoodPartnerMiddleware,authUserMiddleware
};

