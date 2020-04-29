var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  port     : '3306',
  user     : 'root',
  password : 'Emma1219',
  database : 'peliculas'
});

module.exports = connection;

