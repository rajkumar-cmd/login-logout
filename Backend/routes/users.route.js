const express = require("express");
const { UserModel } = require("../model/users.model");
const bcrypt = require("bcrypt");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    const { name,
        email,
        password,
        securityQuestion,
        securityAnswer } = req.body;
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                console.log(err);
            } else {
                const user = new UserModel({
                    name,
                    email,
                    password: hash,
                    securityQuestion,
                    securityAnswer
                });
                await user.save();
                res.send({ "msg": "Registered" })
            }
        })
    } catch (err) {
        res.send({ "msg": err })
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.find({ email });
        if (user.length > 0) {
            const hash = user[0].password;
            bcrypt.compare(password, hash, (err, result) => {
                if (result) {
                    res.send({ "msg": "Logged in", "email": user[0].email, "SQ": user[0].securityQuestion });
                } else {
                    res.send({ "msg": "Wrong Credientials" })
                }
            })
        } else {
            res.send({
                "msg": "Wrong Credientials"
            })
        }
    } catch (err) {
        res.send({ "msg": err })
    }
})

userRouter.post("/getQuestion", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.find({ email });
        if (user.length > 0) {
            res.send({ "msg": "Security Question", "email": user[0].email, "SQ": user[0].securityQuestion });
        }
        else {
            res.send({
                "msg": "Email not found"
            })
        }
    } catch (err) {
        res.send({ "msg": err })
    }
})

userRouter.post("/forgetPassword", async (req, res) => {
    const { email,password,securityAnswer } = req.body;
    try {
        const user = await UserModel.find({ email });
        if (user.length > 0) {
            if (securityAnswer == user[0].securityAnswer) {
                const hashedPassword = await bcrypt.hash(password, 5);
                await UserModel.findOneAndUpdate(
                    { email },
                    { password: hashedPassword }
                )
                res.send({
                    msg: "Password changed successfully"
                });
            }
            else {
                res.send({
                    msg: "Wrong Security Answer"
                });
            }
        }
        else {
            res.send({
                "msg": "Wrong Credentials"
            })
        }
    } catch (err) {
        res.send({ "msg": err })
    }
})

module.exports = {
    userRouter
}