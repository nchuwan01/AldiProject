const express = require('express')
const app = express()
let bodyParser = require('body-parser')
app.set('view engine', 'pug');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'));
const session = require('express-session');
const path = require('path');
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
    res.render("login")
});
let i =0;
app.post("/requested", function (req,res){
    let sVal = req.body.selectVal;
    let startD = req.body.startDate;
    let endD = req.body.endDate;
    let com = req.body.TextInfo;
    let TodayDate = startD.getFullYear;

    i++;
    if(sVal && startD && endD)
    {
        if(req.session.loggedin)
        {
            connection.query('INSERT INTO request(employeeid,requestStatus, startDate, endDate, commentRequest, numDaysOff,requestType,requestid,leaderid) values(?,?,?,?,?,?,?,?,?)',
                [username, "pending", startD, endD, com,5,sVal,i,1234], (error, results, field) => {
                    if (error) {
                        return console.error(error.message);
                    }
                    res.render("ManagerFiles/RequestPage")
                    res.end();
                });
        }
        }
    else
        console.log("Please reenter");
})

app.post('/reset',function (req, res){
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    connection.query('SELECT count(1) AS count FROM employee WHERE employeeid =? AND email = ?',[username,email],(error, results,field)=>
    {
        if (error) throw "Error!";
        var string = JSON.stringify(results);
        var json = JSON.parse(string);
        if(json[0].count === 1){
            connection.query('UPDATE login SET password=? WHERE employeeid = ?',[password[0],username],(error,results,field )=>{
                if (error){
                    return console.error(error.message);
                    alert("ERROR: incorrect email or username");
                }
                res.render("login")
                res.end();
            })
        }
    })
})

app.post('/register', function (req,res) {
    let employeeid = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    connection.query('SELECT Count(1) AS count FROM employee WHERE employeeid = ? AND email= ?', [employeeid, email], function (error, results, fields) {
        if (error) throw "Error!";
        var string = JSON.stringify(results);
        var json = JSON.parse(string);

        if (json[0].count === 1) {
            connection.query('INSERT INTO login(employeeid,password) values(?, ?)', [employeeid, password], (error, results, field) => {
                if (error) {
                    return console.error(error.message);
                }
                res.render("logIn")
                res.end();
            });
        }
    })
});

app.post('/auth',function (req,res){
    username = req.body.username
    let password = req.body.password
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
                    var string = JSON.stringify(results);
                    var json = JSON.parse(string);

                    if (error) throw error;
                    if(json[0].role === "Employee"){
                        res.redirect("/devHomePage")
                        res.end();
                    }else if(json[0].role === "Manager"){
                        res.redirect("/managerHomePage")
                        res.end();
                    }else{
                        res.redirect("/directorHomePage")
                    }});
            }  else {
                res.render("login", {data: "Incorrect Employee ID/Password"})
            }
        });
    } else {
        res.send({username},{password})
        res.send('Please enter Username and Password!');
        res.end();
    }
});

app.get("/managerStatusPage", function (req, res){
    if(req.session.loggedin){
        connection.query('SELECT * FROM employee NATURAL JOIN request WHERE employeeid = ?',[username],function(error,results,fields){
            if (Object.keys(results).length === 0){
                connection.query('SELECT firstName, lastName FROM employee WHERE employeeid = ?',[username],function(error,results,fields){
                    var string = JSON.stringify(results);
                    var json = JSON.parse(string);
                    let array = Object.values(json[0])
                    res.render("ManagerFiles/managerStatusPage",{
                        empname: name,
                        lname: lastname,
                        array,
                        rows: results
                    });
                })
            }else {
                var string = JSON.stringify(results);
                var json = JSON.parse(string);
                name =  json[0].firstName;
                lastname = json[0].lastName;
                let array = Object.values(json[0])
                res.render("ManagerFiles/managerStatusPage",{
                    empname: name,
                    lname: lastname,
                    array,
                    rows: results
                });
            }
        })}
    else{
        res.send('Please login to view this page!');
    }
})
app.get("/devStatusPage", function (req, res){
    if(req.session.loggedin){
        connection.query('SELECT * FROM employee NATURAL JOIN request WHERE employeeid = ?',[username],function(error,results,fields){
            if (Object.keys(results).length === 0){
                connection.query('SELECT firstName, lastName FROM employee WHERE employeeid = ?',[username],function(error,results,fields){
                    var string = JSON.stringify(results);
                    var json = JSON.parse(string);
                    let array = Object.values(json[0])
                    res.render("devPugs/devStatusPage",{
                        empname: name,
                        lname: lastname,
                        array,
                        rows: results
                    });
                })
            }else {
                var string = JSON.stringify(results);
                var json = JSON.parse(string);
                name =  json[0].firstName;
                lastname = json[0].lastName;
                let array = Object.values(json[0])
                res.render("DevPugs/devStatusPage",{
                    empname: name,
                    lname: lastname,
                    array,
                    rows: results
                });
            }
        })}
    else{
        res.send('Please login to view this page!');
    }
})
app.get("/managerPrintReport", function (req, res){
    res.render("ManagerFiles/managerPrintReport")
})
app.get("/directorPrintReport", function (req, res){
    if(req.session.loggedin){
        connection.query('SELECT firstName, lastName FROM employee WHERE employeeid = ?',[username],function(error,results,fields){
            var string = JSON.stringify(results);
            var json = JSON.parse(string);
            name =  json[0].firstName;
            lastname = json[0].lastName;
            if (error) throw error;
            res.render("DirectorPages/directorPrintReport",{
                user: username,
                date: mdate,
                empname: name,
                lname : lastname
            });
        })}else{
        res.send('Please login to view this page!');
    }
})
app.get("/managerEmployeeReport", function (req, res){
    if(req.session.loggedin){
        connection.query('SELECT firstName, lastName FROM employee WHERE employeeid = ?',[username],function(error,results,fields){
            var string = JSON.stringify(results);
            var json = JSON.parse(string);
            name =  json[0].firstName;
            lastname = json[0].lastName;
            if (error) throw error;
            res.render("ManagerFiles/managerEmployeeReport",{
                user: username,
                date: mdate,
                empname: name,
                lname : lastname
            });
        })}else{
        res.send('Please login to view this page!');
    }
})
app.get("/directorEmployeeReport", function (req, res){
    if(req.session.loggedin){
        connection.query('SELECT firstName, lastName FROM employee WHERE employeeid = ?',[username],function(error,results,fields){
            var string = JSON.stringify(results);
            var json = JSON.parse(string);
            name =  json[0].firstName;
            lastname = json[0].lastName;
            if (error) throw error;
            res.render("DirectorPages/directorEmployeeReport",{
                user: username,
                date: mdate,
                empname: name,
                lname : lastname
            });
        })}else{
        res.send('Please login to view this page!');
    }
})
app.get("/directorHomePage", function(req, res) {
    if(req.session.loggedin){
        connection.query('SELECT firstName, lastName FROM employee WHERE employeeid = ?',[username],function(error,results,fields){
            var string = JSON.stringify(results);
            var json = JSON.parse(string);
            name =  json[0].firstName;
            lname =  json[0].lastName;
            if (error) throw error;
            res.render("DirectorPages/DirectorHomePage",{
                user: username,
                date: mdate,
                empname: name,
                lname : lname
            });
        })}else {
        res.send('Please login to view this page!');
    }})
app.get("/makeRequest", function(req, res) {
    if(req.session.loggedin){
        connection.query('SELECT firstName, lastName FROM employee WHERE employeeid = ?',[username],function(error,results,fields){
            var string = JSON.stringify(results);
            var json = JSON.parse(string);
            name =  json[0].firstName;
            lastname = json[0].lastName;
            if (error) throw error;
            res.render("ManagerFiles/RequestPage",{
                user: username,
                date: mdate,
                empname: name,
                lname : lastname
            });
        })}else{
        res.send('Please login to view this page!');
    }
})
app.get("/devmakeRequest", function(req, res) {
    if(req.session.loggedin){
        connection.query('SELECT firstName, lastName FROM employee WHERE employeeid = ?',[username],function(error,results,fields){
            var string = JSON.stringify(results);
            var json = JSON.parse(string);
            name =  json[0].firstName;
            lastname = json[0].lastName;
            if (error) throw error;
            res.render("DevPugs/devRequestPage",{
                user: username,
                date: mdate,
                empname: name,
                lname : lastname
            });
        })}else{
        res.send('Please login to view this page!');
    }
})
app.get("/devHomePage", function(req, res) {
    if(req.session.loggedin){
        connection.query('SELECT firstName, lastName FROM employee WHERE employeeid = ?',[username],function(error,results,fields){
            var string = JSON.stringify(results);
            var json = JSON.parse(string);
            name =  json[0].firstName;
            lastname =  json[0].lastName;
            if (error) throw error;
            res.render("DevPugs/devHomePage",{
                user: username,
                date:mdate,
                empname: name,
                lname: lastname
            });
        })}else{
        res.send('Please login to view this page!');
    }
});
app.get("/managerHomePage", function(req, res) {
    if(req.session.loggedin){
        connection.query('SELECT firstName, lastName FROM employee WHERE employeeid = ?',[username],function(error,results,fields){
            var string = JSON.stringify(results);
            var json = JSON.parse(string);
            name =  json[0].firstName;
            lastname =  json[0].lastName;
            if (error) throw error;
            res.render("ManagerFiles/managerHomePage",{
                user: username,
                date:mdate,
                empname: name,
                lname: lastname
            });
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
let port = 3029;
app.listen(port, ()=>{
    console.log("Listening on http://localhost:" + port);
});