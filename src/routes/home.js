
const multer = require("multer")

module.exports = function (application) {

    application.get('/', function (req, res) {
        application.src.controllers.home.home(application, req, res)
    })
}