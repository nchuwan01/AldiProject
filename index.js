const express = require('express')
const app = express()
const con = require('./public/js/db')
let bodyParser = require('body-parser')
const e = require("express");
app.set('view engine', 'pug');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))

app.get("/logIn", function (req, res){
    res.render("logIn")
})
app.get("/managerStatusPage", function (req, res){
    res.render("ManagerFiles/managerStatusPage");
})
app.get("/devStatusPage", function (req, res) {
    qu = "SELECT * FROM employee WHERE employeeID = 416341"

    con.query(qu, function (error, data) {
        if (error)
            throw error
        else
            var string = JSON.stringify(data);
        console.log('>> string: ', string);
        var json = JSON.parse(string);

        res.render("DevPugs/devStatusPage", {name:json[0].firstName});
    })
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

let port = 3019;
app.listen(port, ()=>{
    console.log("Listening on http://localhost:" + port);
})
