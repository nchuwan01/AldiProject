/* connects to the database */
let mysql = require('mysql');

let connection = mysql.createConnection({
    host: '45.55.136.114',
    user: 'kingsF2022',
    password: 'king_r_here!',
    database: 'kingsF2022'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('connected!');
});

module.exports = connection;