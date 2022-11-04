/* connects to the database */
let mysql = require('mysql');

let con = mysql.createConnection({
    host: '45.55.136.114',
    user: 'kingsF2022',
    password: 'kings_r_here!',
    database: 'kingsF2022'
});

con.connect(function(err) {
    if (err) throw err;
    console.log('connected!');
});

module.exports = con;