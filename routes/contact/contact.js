const contact = require('express').Router()
const path = require('path')
const nodemailer = require('nodemailer')


contact.get('/contact', async(req,res)=>{
    res.render(path.join(__dirname, '../../views/contact/contact.pug'))
})
contact.post('/contact', async(req,res)=>{
    if(!req.body){
        return res.render(path.join(__dirname, '../../views/contact/contact.pug'), {msg: 'Data Not Found'})
    }
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mysocialmedi123@gmail.com',
            pass: 'pmvcvqmpwmnniuru'
        }
    })
    let info =      await transporter.sendMail({
        from:       `<mysocialmedi123@gmail.com> <${req.body.email}>`, // sender address
        to:         "ramzi@ramziben.live, ramzibenchadi5@gmail.com", // list of receivers
        subject:    `${req.body.subject}`,
        text:       `You Have A New Message From Contact Page In Paxon Tools`,
        html:       `<p>${req.body.message}</p><h3>${req.body.email}</h3>`

        },(err)=>{
        if (err){
            //console.log(err)
            res.render(path.join(__dirname, '../../views/contact/contact.pug'), {msg:'Email Send Failed To Admin'})
        }else{
            //console.log('start ' + info.response)
            res.render(path.join(__dirname, '../../views/contact/contact.pug'), {msg:'Email Send Success To Admin'})
        }
    });
    
    //console.log("Message sent: %s", info.messageId);

    //transporter.sendMail(info, )
})

module.exports = contact
