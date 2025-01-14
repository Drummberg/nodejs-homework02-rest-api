const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../../models');
const { loginSchema } = require('../../sheme/user');
const { createError } = require("../../helpers");
const { SECRET_KEY } = process.env;

const login = async (req, res) => {
    const { error } = loginSchema.validate(req.body);

    if (error) {
        throw createError(401, 'Email is wrong'); 
    }

    const {email, password} = req.body;
    const user = await User.findOne({ email });

    if(!user.verify){
        throw createError(401, "Email not verify");
    }
    
    const comparePassword = bcrypt.compare(password, user.password);
    if (!user || !comparePassword) {
        throw createError(401, 'Email or password is wrong');
    }

    const payload = {
        id: user._id
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
    await User.findByIdAndUpdate(user._id, {token})
    res.json({
        token        
    })
}

module.exports = login;
