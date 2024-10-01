const express = require('express')
const mongo = require('./mongo/mongoose.js')


const app = express()
app.use(express.json());


var regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
var pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
app.get('/', async (readd .q, res)=>{
    const users = await mongo.find({})
    res.status(200).json(users)
})

app.post('/register', async (req, res) => {
    
    if(!req.body.username || !req.body.password || !req.body.email) {
        res.status(404).send('Please make sure those fields are properly filled')
    }else if (regex.test(req.body.email) == false){
        res.status(404).send('Please make sure you input appropriate email')
    }else if (pattern.test(req.body.password) == false) {
        res.status(404)
        .send('Please make sure your password length is more than 7 and it must possess atleast a block letter, a special character and number')
    }
    else{
        const check = await mongo.findOne({email: req.body.email})

        if (check) {
            res.status(400).send('email already exist')
            return 0
        }else{

                res.send('email not present')
            const insert = await mongo.insertMany(req.body);

            if (insert) {
                res.status(200).send('you have successfully registered')
            }else{
                res.status(500).send('something went wrong')
            }
        }
    }
})

app.post('/login', async (req, res) => {
    if(!req.body.email ||!req.body.password) {
        res.status(404).send('Please make sure those fields are properly filled')
    }else{
        const check = await mongo.findOne({email: req.body.email})
        if (check) {
            if(check.password === req.body.password){
                res.status(200).send('Login Successful')
            }else{
                res.status(401).send('Incorrect Password')
            }
        } else {
            res.status(404).send('Email not found')
        }
    }
})


app.put('/updatePassword', async (req, res) => {
    if(!req.body.email ||!req.body.password || !req.body.confirmPassword) {
        res.status(404).send('Please make sure those fields are properly filled')
    }else{
        if(req.body.password!== req.body.confirmPassword){
            res.status(404).send('Passwords do not match')
        }else if (pattern.test(req.body.password) == false) {
            res.status(404)
           .send('Please make sure your password length is more than 7 and it must possess atleast a block letter, a special character and number')
        }else{
            const check = await mongo.findOne({email: req.body.email})
            if (check) {
                const update = await mongo.updateOne({email: req.body.email}, {$set: {password: req.body.password}});
                if(update){
                    res.status(200).send('Password updated successfully')
                }
            }else{
                res.status(404).send('email not present')
            }
        }
    }

    
})


app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
})