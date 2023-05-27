const scrape = require('express').Router()
const checkIsAuthentificate = require('../signin/checkIsAuthentificate')
const path = require('path')
const cheerio = require('cheerio')
const axios = require('axios')

scrape.get('/scrape', async(req, res)=>{
    //if(await checkIsAuthentificate(req,res) === true){
        //res.render(path.join(__dirname, '../../views/scrape/index.html'))  
        res.sendFile(path.join(__dirname, '../../views/scrape/', 'index.html'))          
    //}else{
        //res.redirect('/login')
    //}
})
scrape.get('/scrape-link', async(req, res)=>{
    const API = "https://www.wixfresh.com/contact-us"
    try {
        //await axios.get(API) 
	         //.then(({ data }) => console.log(data));
        const data = await axios.get(API)
                                //.then((data)=>{data.json()})
                                .then((response)=>{ //data.json()
                                    const $ = cheerio.load(response)
                                    const elements = $('*')
                                    const scrapedData = []
                                    elements.each((index,element)=>{
                                        const scrapItem = { title: '' }
                                        scrapItem.title = element.text()
                                        scrapedData.push(scrapItem)
                                        
                                })
                                res.json(scrapedData)
                                /*if(response)
                                    res.json(response.data)
                                else if(scrapedData && scrapedData != [])
                                    res.json({scrapedData})*/


        })/*.then((data)=>{
            console.log(data)
            res.send(data)
        })*/

    } catch(error){
        console.log(error)
        console.log('koko')
    }        
})

module.exports = scrape