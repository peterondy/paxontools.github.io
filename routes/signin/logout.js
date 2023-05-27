const logout = require('express').Router()
//const checkIsAuthentificate = require('../signin/checkIsAuthentificate')
//const path = require('path')


logout.get('/logout', (req,res)=>{
    res.clearCookie('uid')
    res.redirect('/login')
})


module.exports = logout