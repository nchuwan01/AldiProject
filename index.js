const express = require('express')
const con = require('./public/js/db')
const app = express()
let bodyParser = require('body-parser')

app.set('view engine', 'pug');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))

app.get("/managerStatusPage", function (req, res){
    res.render("managerStatusPage")
})

let port = 3000;
app.listen(port, ()=>{
    console.log("Listening on http://localhost:" + port);
});
