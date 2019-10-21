const express = require('express');
const router = new express.Router();
const Post = require('../__models/postModel');
const Chunk = require('../__models/chunkModel');
const User = require('../__models/userModel');
const keys = require('../config');
const auth = require('../__middleware/auth');

/*
    CREATE POST
    method: POST
    body: 
        {
            title: String required
            content: String required
            originalChunk: {
                name: String
                chunkid: ObjectID
            }
        }
*/
router.post('/post/create', async (req, res) => {
    try {
        const owner = await User.findById(req.body.userid);
        const post = new Post({
            ...req.body,
        });
        post.owner = {
            username: owner.username,
            userid: owner._id
        };
        post.postedAt = new Date();
        post.nibblScore = 0;
        await post.save();

        res.status(201).send(post);
    } catch(e) {
        res.status(400).send('Error creating post');
    }
});

/*
    GET ALL POSTS ON CHUNK
    method: GET
    body: {
        chunkid: ObjectID
    }
*/
router.get('/post/chunk/:chunkid', auth, async (req, res) => {
    try {
        console.log(req.params.chunkid);
        // const chunkid = req.params.chunkid.toLowerCase() === "home" ? keys.rootChunkid : req.body.chunkid 
        const chunkid = req.params.chunkid;
        const posts = await Post.find({chunkid});
        console.log(posts);
        res.status(200).send(posts);
    } catch(e) {
        res.status(400).send('Error retrieving posts');
    }
});

/*
    DELETE POST
    method: DELETE
    body: {
        postid: ObjectID
    }
*/
router.delete('/post', auth, async (req, res) => {
    try{
       const post = await Post.findByIdAndDelete(req.body.postid);
       if(!post) {
           res.status(400).send('Error Deleting Post');
       }
       res.status(200).send(post);
    } catch(e) {
        res.status(400).send('Error Deleting Post');
    }
});

module.exports = router;