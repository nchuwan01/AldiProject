const express = require('express')
const app = express()
let bodyParser = require('body-parser')
app.set('view engine', 'pug');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))
const session = require('express-session');
const path = require('path');
const mysql = require('mysql');
let connection = require ("./dbLogin");
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'static')))


app.get('/', function(req, res) {
    // Render login template
    res.render("login")
});

app.get("/managerStatusPage", function (req, res){
    res.render("ManagerFiles/managerStatusPage");
})
app.get("/devStatusPage", function (req, res){
    res.render("DevPugs/devStatusPage")
})
app.get("/managerPrintReport", function (req, res){
    res.render("ManagerFiles/managerPrintReport")
})
app.get("/directorPrintReport", function (req, res){
    res.render("DirectorPages/directorPrintReport")
})
app.get("/managerEmployeeReport", function (req, res){
    res.render("ManagerFiles/managerEmployeeReport")
})
app.get("/directorEmployeeReport", function (req, res){
    res.render("DirectorPages/directorEmployeeReport")
})
app.get("/directorHomePage", function(req, res) {
    res.render("DirectorPages/DirectorHomePage");
})
app.get("/makeRequest", function(req, res) {
    res.render("ManagerFiles/RequestPage");
})
app.get("/devmakeRequest", function(req, res) {
    res.render("DevPugs/devRequestPage");
})
app.get("/devHomePage", function(req, res) {
    res.render("DevPugs/devHomePage");
})
app.get("/managerHomePage", function(req, res) {
    res.render("ManagerFiles/managerHomePage");
})
app.get("/resetPassword", function (req, res){
    res.render("resetPassword")
})
app.get("/registrationPage", function (req, res){
    res.render("registrationPage")
})
let port = 3021;
app.listen(port, ()=>{
    console.log("Listening on http://localhost:" + port);
});
