const express = require('express')
const router = express.Router()
const {ensureAuthenticated} =require('../helper/authHelper')
const User = require('../Models/UserModels')
const Content = require('../Models/Content')


router.get('/profile/:id',ensureAuthenticated,(req,res) => {
    Content.find({userId:req.params.id})
    .populate('user')
    .then((data)=>{
        console.log(data)
        res.render('profile/index',{
        UserData:data,
        user:req.user
    })
    })
})

module.exports = router