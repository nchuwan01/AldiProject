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
    res.render("managerStatusPage");
})
app.get("/devStatusPage", function (req, res){
    res.render("devStatusPage")
})
app.get("/managerPrintReport", function (req, res){
    res.render("managerPrintReport")
})
// app.get("/devPrintReport", function (req, res){
//     res.render("devPrintReport")
// })

let port = 3018;
app.listen(port, ()=>{
    console.log("Listening on http://localhost:" + port);
});
