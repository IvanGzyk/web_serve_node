const itemsModel = require("../models/items")

module.exports.home = function (application, req, res) {
  itemsModel.getItems().then(dados => res.render("items/index", { items: dados }))
}

module.exports.busca_item = function(application, req, res){
  itemsModel.getItem([req.params.item_id]).then(dados => redirecionaItem(dados, res))
}

module.exports.busca_todos = function (application, req, res) {
  itemsModel.getItems().then(dados => {return res.send(dados)})
}

function redirecionaItem(dados, res){
  if(dados[0]){
    res.render("items/item", { items: dados })
  }else{
    res.render("home/home")
  }
  
}