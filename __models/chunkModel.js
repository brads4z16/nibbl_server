const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config').keys;

const chunkSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    children: [
        {
            name: {
                type: String
            },
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Chunk'
            }
        }
    ]
});


const Chunk = mongoose.model('Chunk', chunkSchema);

module.exports = Chunk;