const Home = require('../controllers/Home')
const multer = require("multer")
module.exports = function (application) {

    application.get('/', function (req, res) {
        Home.Home.home(application, req, res)
        //home.home(application, req, res)
        //application.src.controllers.home.home(application, req, res)
    })
}