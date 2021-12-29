
class Home {
    constructor(){

    }

    home(application, req, res){
        res.render("home/home")
    }
}
module.exports.Home = new Home()