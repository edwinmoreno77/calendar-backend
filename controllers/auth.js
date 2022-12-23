const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const User = require('../models/UserModel');


const createUser = async (req, res = response) => {

    const { name, email, password } = req.body;
    try {

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                ok: false,
                message: 'Un usuario ya existe con ese correo'
            });
        }
        user = new User(req.body);

        //encrypt password
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);

        await user.save();

        //generate JWT
        const token = await generateJWT(user.id, user.name);


        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Please contact the administrator'
        });
    }
}

const loginUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario no existe con ese correo'
            });
        }

        //password validation
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                message: 'Password incorrecto'
            });
        }

        //generate JWT
        const token = await generateJWT(user.id, user.name);


        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Please contact the administrator'
        });
    }
}

const renewToken = (req, res = response) => {
    res.json({
        ok: true,
        message: 'renew'
    });
}

module.exports = {
    createUser,
    loginUser,
    renewToken
}
