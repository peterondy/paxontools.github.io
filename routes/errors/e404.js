const e404 = require('express').Router()
const path = require('path')


e404.get('/404', (req, res)=>{
    return res.status(404).sendFile(path.join(__dirname, '../../views/errors/404.html'));
})

module.exports = e404