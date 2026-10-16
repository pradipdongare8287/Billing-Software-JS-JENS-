const express = require('express')
const Website = express()
const session = require('express-session')
const { read } = require('fs')
const mysql = require('mysql2')
const util = require('util')

var database = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'js_jens_bank'
})

const query = util.promisify(database.query).bind(database)

 function session_check(req,res,next){
    if(req.session.username && req.session.password){
        next()
    }
    else{
        res.redirect('/login')
    }
 }

Website.use(session({
    secret:'Js_jens',
    resave:false,
    saveUninitialized:true
}))

Website.use(express.urlencoded({extended:true}))
Website.use(express.static('public'));


Website.get('/',session_check,(req,res)=>{
    res.render('Software.ejs')
})

Website.get('/login',(req,res)=>{
    res.render('login.ejs')
})

Website.post('/login_check',async(req,res)=>{
    var {username,password} = req.body
    var check_login = 'select * from login where Username = ? and Password = ?'
    var get_user = await query(check_login,[username,password])
    if(get_user[0]){
        req.session.username = get_user[0].Username
        req.session.password = get_user[0].Password
        res.redirect('/')
    }
    else{
        res.redirect('/login')
    }
    // res.send(get_user)
    
    // res.send(req.body)
})

Website.listen(3000)