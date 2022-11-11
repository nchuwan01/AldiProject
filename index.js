const express = require('express')
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
app.get("/directorHomePage", function (req, res){
    res.render("DirectorHomePage");
})


app.get("/makeRequest", function (req, res){
    res.render("RequestPage");
})



let port = 3018;
app.listen(port, ()=>{
    console.log("Listening on http://localhost:" + port);
});
