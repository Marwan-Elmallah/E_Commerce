const { User } = require("../database/schemas");
const { findAllFactory, deleteOneFactory, findOneFactory } = require("./handlerFactory")
const bcrypt = require("bcrypt")
const TokenManager = require("../utils/jwt");
const ApiError = require("../utils/apiErrors");
const { default: slugify } = require("slugify");


class UserController {
    static create = async (req, res, next) => {
        try {
            let dataInBody = req.body
            dataInBody.username = slugify(dataInBody.username)
            const userExist = await User.findOne({
                $or: [
                    { username: dataInBody.username },
                    { email: dataInBody.email }
                ]
            });
            if (userExist) {
                return res.status(401).json({ msg: "user already exist" })
            }
            const user = await User.create(dataInBody)
            if (!user) {
                return res.status(400).json({ msg: "user not created" })
            }
            return res.status(201).json({ data: user })
        } catch (error) {
            console.log(error);
            return next(new ApiError(error.msg, 500))
        }
    }

    static findAll = findAllFactory(User)

    static update = async (req, res, next) => {
        try {
            const { id } = req.params
            let dataInBody = req.body
            const user = await User.findByIdAndUpdate(id, dataInBody, { new: true })
            if (!user) {
                return res.status(401).json({ msg: "user not updated" })
            }
            return res.status(201).json({ data: user })
        } catch (error) {
            console.log(error);
            return next(new ApiError(error.msg, 500))
        }
    }

    static remove = deleteOneFactory(User)

    static findById = findOneFactory(User)

    static login = async (req, res) => {
        const userExist = await User.findOne({
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        })
        // console.log(userExist);
        if (!userExist) {
            return res.status(400).json({ msg: "User Not Found" });
        }

        const match = await bcrypt.compare(req.body.password, userExist.password);
        if (!match) {
            return res.status(400).json({ msg: "Wrong Password" });
        }
        const token = TokenManager.generateToken({ id: userExist._id, username: userExist.username, role: userExist.role }, 1);
        return res.status(200).json({ msg: `Welcome ${userExist.username}`, validFor: "1 day", token });
    }
}

module.exports = UserController