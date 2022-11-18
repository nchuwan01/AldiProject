/* connects to the database */
let mysql = require('mysql');
// let PTODATA = require('./PTOAccrualBrackets.json');
// let PTOUserData = require('./PTOUserSeedData.json');

let con = mysql.createConnection({
    host: '45.55.136.114',
    user: 'kingsF2022',
    password: 'kings_r_here!',
    database: 'kingsF2022'
});


con.connect((err) => {
    if (err)
        return console.error('error: ' + err.message);
    else
        return console.log("successful connection")
});

module.exports = con;