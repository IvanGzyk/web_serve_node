const Sequelize = require('sequelize')
const mysql = require('mysql2')

//conexão sequelize
const sequelize = new Sequelize('api_magento', 'root', 'root', {
    host: '192.168.0.241',
    dialect: 'mysql'
});

// conexão ecommercedb
const eco_db = mysql.createConnection({
    host: '192.168.0.240',
    user: 'laravel',
    password: '4force*',
    database: 'ecommercedb'
});

//conexão E003
const hardness_db = mysql.createConnection({
    host: '192.168.0.239',
    user: 'hardness',
    password: 'h@rdness!web',
    database: 'E003'
});

setInterval(function () {
    eco_db.query('SELECT 1')
    hardness_db.query('SELECT 1')
}, 5000);

module.exports.sequelize = sequelize;
module.exports.eco_db = eco_db;
module.exports.hardness_db = hardness_db;