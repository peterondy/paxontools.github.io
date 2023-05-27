const wordcounter = require('express').Router()
const path = require('path')


wordcounter.get('/word-counter', (req, res)=>{
    return res.sendFile(path.join(__dirname, '../../views/word-counter/word-counter.html'));
})

module.exports = wordcounter