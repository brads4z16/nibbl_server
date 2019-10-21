const express = require('express');
const router = new express.Router();
const User = require('../__models/userModel');
const auth = require('../__middleware/auth');

// CREATE USER
/* 
    method: POST
    route: /user
    body: 
        {
            username: String,
            password: String,
            email: String,
            age: Number
        }
*/
router.post('/user', async (req, res) => {
    console.log('here');
    const user = new User(req.body);
    let errors = [];
    if(user.age < 13) {
        errors.push('Must be 13 years or older');
    }
    let passwordreg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*`?&-=|#+;~^></\\(){}\[\]])[A-Za-z\d$@$!%*`?&-=|#+;~^&gt;&lt;/\\(){}\[\]]{8,}/;
    if(!passwordreg.test(user.password)) {
        errors.push('Invalid Password: Must contain 8 characters, a number, and a special character');
    }
    let emailreg = /^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(!emailreg.test(user.email)) {
        errors.push('Invalid Email');
    }
    if(errors.length > 0) {
        res.status(400).send({errors});
    }
    try {
        // await user.save()
        const token = await user.generateAuthToken(user.email, user.password)
        res.status(201).send(user.toJSON()) //201 status = CREATED
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
});

/*
    LOGIN USER
    method: POST
    route: /user/login
    body:
        {
            username: String,
            password: String
        }
*/
router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findUserByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        
        res.status(200).send({user: user.toJSON()});
    } catch(e) {
        res.status(400).send({ error: 'Invalid Credentials'});
    }
});


/*
    DELETE A USER
    method: DELETE
    route: /user/delete/:userid
    body: 
        {
            userid: ID
        }
*/
router.delete('/user/delete/:userid', auth, async (req, res) => {
    const userid = req.params.userid;

    try {
        const user = await User.findOneAndDelete({ _id: userid });
        
        if(!user) {
            res.status(400).send({error: "No User Found"});
        }
        res.send(user.toJSON());
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
})

module.exports = router;