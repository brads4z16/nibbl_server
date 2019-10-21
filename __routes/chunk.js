const express = require('express');
const router = new express.Router();
const Chunk = require('../__models/chunkModel');
const keys = require('../config');
const auth = require('../__middleware/auth');

//Create root chunk
router.post('/chunk/root', auth, async (req, res) => {
    console.log(req.body);
    const homeChunk = new Chunk(req.body);
    try{
        await homeChunk.save();
        res.status(201).send('Root chunk created');
    } catch(e) {
        res.status(400).send('Could not create root');
    }
});

router.get('/chunk/root', auth, async (req, res) => {
    try {
        const root = await Chunk.findById(keys.rootChunkid);
        if(!root) {
            res.status(500).send('Could not find home chunk');
        }
        res.status(200).send(root);
    } catch(e) {
        res.status(500).send('Could not find home chunk');
    }
});

router.get('/chunk/:chunkid', auth, async (req, res) => {
    try {
        const chunk = await Chunk.findById(req.params.chunkid);
        if(!chunk) {
            res.status(400).send('Could not find chunk');
        }
        res.status(200).send(chunk);
    } catch(e) {
        res.status(400).send('Could not find chunk');
    }
})

/*
    CREATE CHUNK
    method: POST
    body: 
        {
            parentid: ObjectID
        }

*/
router.post('/chunk', auth, async (req, res) => {
    
});

router.delete('/chunk/:chunkid', auth, async (req, res) => {
    const chunkid = req.params.chunkid;

    try {
        const chunk = await Chunk.findOneAndDelete({ _id: chunkid });

        if(!chunk) {
            res.status(400).send('No Chunk Found');
        }

        res.send(chunk);
    } catch(e) {
        res.status(500).send('Could not delete');
    }
})

module.exports = router;