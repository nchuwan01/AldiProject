const express = require('express')
const con = require('./public/js/db')
const app = express()
let bodyParser = require('body-parser')

app.set('view engine', 'pug');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))

app.get("/testing", function (req, res){
    res.render("Testing", {date: new Date()});
})

app.get("/managerStatusPage", function (req, res){

    res.render("managerStatusPage");
})

let port = 3011;
app.listen(port, ()=>{
    console.log("Listening on http://localhost:" + port);
});
