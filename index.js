const express = require('express')
const app = express()
let bodyParser = require('body-parser')
let con = require('./public/js/db')
app.set('view engine', 'pug');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))
const session = require('express-session');
const path = require('path');
const mysql = require('mysql');
let connection = require ("./dbLogin");
let username ="";
let name="";
let date = new Date();
let day = date.getDate();
let month = date.getMonth()+1;
let year = date.getFullYear();
let hours= date.getHours();
let minutes=date.getMinutes();
let seconds= date.getSeconds();
let mdate=`${year}-${month}-${day}`
let fullDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

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


app.post('/auth',function (req,res){
    username = req.body.username
    let password = req.body.password
    console.log(username,password)
    if(username && password){
        connection.query('SELECT * FROM login WHERE employeeid = ? AND password = ?', [username, password], function(error, results, fields) {
        // If there is an issue with the query, output the error
            if (error) throw error;
            // If the account exists
            if (results.length > 0) {
                // Authenticate the user
                req.session.loggedin = true;
                req.session.username = username;

                // Redirect to home page
                connection.query('SELECT role FROM employee WHERE employeeid = ?',[req.body.username],function(error,results,fields){
                    console.log(results);
                    var string = JSON.stringify(results);
                    console.log('>> string: ', string);
                    var json = JSON.parse(string);
                    console.log(json[0].role);
                    if (error) throw error;
                    if(json[0].role==="Employee"){
                        //res.render("DevPugs/devHomePage")
                        res.redirect("/devHomePage")
                        res.end();
                    }else if(json[0].role == "Manager"){
                        //res.render("ManagerFiles/managerHomePage")
                        res.redirect("/managerHomePage")
                        res.end();
                    }else{
                        //res.render("DirectorPages/DirectorHomePage")
                        res.redirect("/directorHomePage")
                    }});
            }  else {
                res.render("login", {data: "Incorrect Employee ID/Password"})

               // res.send('Incorrect Username and/or Password!');
            }

        });
    } else {
        console.log(username,password)
        res.send({username},{password})
        res.send('Please enter Username and Password!');
        res.end();
    }
});

app.get("/managerStatusPage", function (req, res){
    let sql = `SELECT * FROM request where employeeid = 817052`
    con.query(sql, function (error, results){
        res.render("ManagerFiles/managerStatusPage", {
            rows : results
        })
    })
})
app.get("/devStatusPage", function (req, res){
    let sql = `SELECT * FROM request where employeeid = 936350`
    con.query(sql, function (error, results){
        res.render("DevPugs/devStatusPage", {
            rows : results
        })
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
    if(req.session.loggedin){
        connection.query('SELECT firstName FROM employee WHERE employeeid = ?',[username],function(error,results,fields){
            console.log(results);
            var string = JSON.stringify(results);
            console.log('>> string: ', string);
            var json = JSON.parse(string);
            console.log(json[0].firstName);
            name =  json[0].firstName;
            console.log(fullDate);
            if (error) throw error;
            res.render("DirectorPages/DirectorHomePage",{
                user: username,
                date:mdate,
                empname: name});
        })}else {
        res.send('Please login to view this page!');
    }})
app.get("/makeRequest", function(req, res) {
    res.render("ManagerFiles/RequestPage");
})
app.get("/devmakeRequest", function(req, res) {
    res.render("DevPugs/devRequestPage");
})
app.get("/devHomePage", function(req, res) {
    if(req.session.loggedin){
        connection.query('SELECT firstName FROM employee WHERE employeeid = ?',[username],function(error,results,fields){
            console.log(results);
            var string = JSON.stringify(results);
            console.log('>> string: ', string);
            var json = JSON.parse(string);
            console.log(json[0].firstName);
            name =  json[0].firstName;
            console.log(fullDate);
            if (error) throw error;
            res.render("DevPugs/devHomePage",{
                user: username,
                date:mdate,
                empname: name});
        })}else{
        res.send('Please login to view this page!');
    }
});
app.get("/managerHomePage", function(req, res) {
    if(req.session.loggedin){
    connection.query('SELECT firstName FROM employee WHERE employeeid = ?',[username],function(error,results,fields){
        console.log(results);
        var string = JSON.stringify(results);
        console.log('>> string: ', string);
        var json = JSON.parse(string);
        console.log(json[0].firstName);
        name =  json[0].firstName;
        console.log(fullDate);
        if (error) throw error;
        res.render("ManagerFiles/managerHomePage",{
            user: username,
            date:mdate,
            empname: name});
    })}else{
        res.send('Please login to view this page!');
    }
});


app.get("/resetPassword", function (req, res){
    res.render("resetPassword")
})
app.get("/registrationPage", function (req, res){
    res.render("registrationPage")
})
let port = 3023;
app.listen(port, ()=>{
    console.log("Listening on http://localhost:" + port);
});
