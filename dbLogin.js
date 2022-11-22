'use strict';

var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createConnection({
    host     : '45.55.136.114',
    user     : 'kingsF2022',
    password : 'kings_r_here!',
    database : 'kingsF2022'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;