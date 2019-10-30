const jwt = require('jsonwebtoken');
const User = require('../__models/userModel');
const keys = require('../config').keys;

const auth = async (req, res, next) => {
    try{
        console.log('*** AUTH MIDDLEWARE ***');
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, keys.SALT);
        const user = await User.findOne({ _id: decoded._id, 'token.value': token});
        if(!user || user.token.voided){
            res.status(401).send({ error: 'Please login' });
        }

        req.token = token
        req.user = user
        next()
    } catch(e){
        res.status(401).send({ error: 'Please login' });
    }
}

module.exports = auth