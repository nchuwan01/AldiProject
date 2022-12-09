const express = require('express')
const app = express()
let bodyParser = require('body-parser')
let con = require('./public/js/db')
app.set('view engine', 'pug');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'));
const session = require('express-session');
const path = require('path');
const mysql = require('mysql');
let connection = require ("./dbLogin");
let username ="";
let name="";
let lastname="";
let role="";
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

app.post("/requested", function (req,res){
    let sVal = req.body.selectVal;
    let startD = req.body.startDate;
    let endD = req.body.endDate;
    let com = req.body.TextInfo;
    if(sVal && startD && endD)
    {
        connection.query('')
        console.log(sVal, startD,endD);
    }
    else
        console.log("Please reneter");
})
app.post('/register', function (req,res) {

    let employeeid = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    console.log(employeeid, password);
    connection.query('SELECT Count(1) AS count FROM employee WHERE employeeid = ? AND email= ?', [employeeid, email], function (error, results, fields) {
        if (error) throw "Error!";
        console.log(results);
        var string = JSON.stringify(results);
        console.log('>> string: ', string);
        var json = JSON.parse(string);
        console.log(json[0].count);

        console.log(employeeid, password);
        if (json[0].count === 1) {
            console.log(employeeid)
            connection.query('INSERT INTO login(employeeid,password) values(?, ?)', [employeeid, password], (error, results, field) => {
                if (error) {
                    return console.error(error.message);
                }
                // get inserted rows
                console.log('Row inserted:' + results.affectedRows);
                res.render("logIn")
                res.end();
            });

        }


        /*  if(results.)
          {
              console.log("Found!");

          }*/

    })
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
                    role=json[0].role;
                    if (error) throw error;
                    if(json[0].role==="Employee"){
                        //res.render("DevPugs/devHomePage")
                        res.redirect("/devHomePage")
                        res.end();
                    }else if(json[0].role === "Manager"){
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
    var Years;
    var VD;
    var maxVD;
    var SD;
    var PD;
    var hiredate;
    var maxSD;
    var maxPD;
    if(req.session.loggedin){
        //gets years worked
        connection.query('SELECT yearsWorked FROM employee WHERE employeeid = ?',[username],function(error,results,fields){
            console.log(results);
            var string = JSON.stringify(results);
            console.log('>> string: ', string);
            var json = JSON.parse(string);
            console.log(json[0].yearsWorked);
            Years =  json[0].yearsWorked;
        });
        //grabs hiredate
        connection.query('SELECT hiredate FROM employee WHERE employeeid=?',[username],function (error,result,field) {
            if (error) throw error;
            console.log(result)
            var string = JSON.stringify(result);
            console.log('>> string: ', string);
            var json = JSON.parse(string);
            console.log(json[0].hiredate.substring(0, 10));
            hiredate = json[0].hiredate.substring(0, 10);
        });
        //grabs  vd from employee
        connection.query('SELECT vacPerYear,yearsWorked FROM accural WHERE role=? ',[role],function(error,results,fields){
            if (error) throw error;
            console.log(results);
            var string = JSON.stringify(results);
            var json=JSON.parse(string);
            var max=0;
            console.log(json)
            for(key in json){
                console.log(json[key].yearsWorked);
                if(json[key].yearsWorked>max){
                    max=json[key].yearsWorked;
                    maxVD=json[key].vacPerYear;
                }
            }
        });//grabs pd
        connection.query('SELECT perPerYear,yearsWorked FROM accural WHERE role=? ',[role],function(error,results,fields){
            if (error) throw error;
            console.log(results);
            var string = JSON.stringify(results);
            var json=JSON.parse(string);
            var max=0;
            console.log(json)
            for(key in json){
                console.log(json[key].yearsWorked);
                if(json[key].yearsWorked>max){
                    max=json[key].yearsWorked;
                    maxPD=json[key].perPerYear;
                }
            }
        });
        //pulls max SD
        connection.query('SELECT sickPerYear,yearsWorked FROM accural WHERE role=? ',[role],function(error,results,fields){
            if (error) throw error;
            console.log(results);
            var string = JSON.stringify(results);
            var json=JSON.parse(string);
            var max=0;
            console.log(json)
            for(key in json){
                console.log(json[key].yearsWorked);
                if(json[key].yearsWorked>max){
                    max=json[key].yearsWorked;
                    maxSD=json[key].sickPerYear;

                }
            }
        });
        //pulls vd sd and pd for employee
        connection.query('SELECT vd, pd, sd FROM ptoBalance WHERE employeeid = ?',[username],function(error,results,fields){
            console.log(results);
            var string = JSON.stringify(results);
            console.log('>> string: ', string);
            var json = JSON.parse(string);
            VD=json[0].vd;
            SD=json[0].sd;
            PD=json[0].pd;
        });

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
                hire:hiredate,
                yearsworked:Years,
                sickdays:SD,
                personaldays:PD,
                vacationdays:VD,
                maxS:maxSD,
                maxV:maxVD,
                maxP:maxPD,
                user: username,
                date:mdate,
                empname: name});
        })}else{
        res.send('Please login to view this page!');
    }
});
app.get("/managerHomePage", function(req, res) {
        var Years;
        var VD;
        var maxVD;
        var SD;
        var PD;
        var requests;
        var hiredate;
        if(req.session.loggedin){
            //gets years worked
            connection.query('SELECT yearsWorked FROM employee WHERE employeeid = ?',[username],function(error,results,fields){
                console.log(results);
                var string = JSON.stringify(results);
                console.log('>> string: ', string);
                var json = JSON.parse(string);
                console.log(json[0].yearsWorked);
                Years =  json[0].yearsWorked;
            });
            //gets a count of all pending requests
            var req="pending";
            connection.query('SELECT * FROM request WHERE leaderid=? AND requestStatus=?',[username,req],function (error,result,field){
                if (error) throw error;
                console.log(result.length)
                requests=result.length
            });
            //grabs hiredate
            connection.query('SELECT hiredate FROM employee WHERE employeeid=?',[username],function (error,result,field){
                if(error) throw error;
                console.log(result)
                var string = JSON.stringify(result);
                console.log('>> string: ', string);
                var json = JSON.parse(string);
                console.log(json[0].hiredate.substring(0,10));
                hiredate=json[0].hiredate.substring(0,10);
            });
            //grabs max vd pd and sd from employee
            connection.query('SELECT vacPerYear,yearsWorked FROM accural WHERE role=? ',[role],function(error,results,fields){
                if (error) throw error;
                console.log(results);
                var string = JSON.stringify(results);
                var json=JSON.parse(string);
                var max=0;
                console.log(json)
                for(key in json){
                        console.log(json[key].yearsWorked);
                     if(json[key].yearsWorked>max){
                         max=json[key].yearsWorked;
                         maxVD=json[key].vacPerYear;
                     }
                }
            });
            //pulls vd sd and pd for employee
            connection.query('SELECT vd, pd, sd FROM ptoBalance WHERE employeeid = ?',[username],function(error,results,fields){
                console.log(results);
                var string = JSON.stringify(results);
                console.log('>> string: ', string);
                var json = JSON.parse(string);
                VD=json[0].vd;
                SD=json[0].sd;
                PD=json[0].pd;
            });
            connection.query('SELECT firstName, lastName FROM employee WHERE employeeid = ?',[username],function(error,results,fields){
            console.log(results);
            var string = JSON.stringify(results);
            console.log('>> string: ', string);
            var json = JSON.parse(string);
            console.log(json[0].firstName);
            name =  json[0].firstName;
            lastname =  json[0].lastName;
            console.log(fullDate);
            if (error) throw error;
            res.render("ManagerFiles/managerHomePage",{
                hire:hiredate,
                pending:requests,
                maxVac:maxVD,
                vac:VD,
                YearsWorked: Years,
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
let port = 3023;
app.listen(port, ()=>{
    console.log("Listening on http://localhost:" + port);
});
