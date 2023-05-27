const errors = require('express').Router()
const path = require('path')

function errorFunc(req,res){
    res.status(parseInt(req.params.errcode)).render(path.join(__dirname, '../../views/errors/error.pug'), {code:req.params.errcode}) 
}

errors.get('/err/:errcode', (req, res)=>{
    errorFunc(req,res)
    //return res.status(404).sendFile(path.join(__dirname, '../../views/errors/404.html'));
})

module.exports = errors