const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const keys = require('../config').keys;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Not a valid email address');
            }
        },
        required: true
    },
    password: {
        type: String,
        minlength: 7,
        trim: true,
        required: true
    },
    age: {
        type: Number
    },
    savedChunks: {
        name: {
            type: String
        },
        chunkid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chunk'
        }
    },
    token: {
        value: {
            type: String
        },
        voided: {
            type: Boolean
        }
    }
});

userSchema.pre('save', async function(next) {
    const user = this;
    user.password = await bcrypt.hash(user.password, 8);
    next()
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user.id.toString() }, keys.SALT, {
        expiresIn: '2h'
    });
    user.token.value = token;
    user.token.voided = false;
    try {
        await user.save();
        return token;
    } catch(e) {
        throw new Error("Error saving user");
    }
    

    return token;
};

userSchema.statics.findUserByCredentials = async function(email, password) {
    email = email.toLowerCase();
    const user = await User.findOne({ email });
    
    if(!user) {
        throw new Error("Invalid Credentials");
    }

    const isMatch = bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error("Invalid Credentials");
    }

    return user;
}

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;