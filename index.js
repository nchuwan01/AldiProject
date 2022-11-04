const express = require('express')
const con = require('./db')
const app = express()
app.set('view engine', 'pug');
let bodyParser = require('body-parser')
const path = require("path");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
app.use(express.json())

app.get("/managerStatusPage", function (req, res){
    res.render("managerStatusPage")
})

let port = 3000;
app.listen(port, ()=>{
    console.log("Listening on http://localhost:" + port);
});
