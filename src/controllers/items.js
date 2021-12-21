module.exports.home = function (application, req, res) {
  const itemsModel = require("../models/items")
  itemsModel.getItems().then(dados => res.render("items/index", { items: dados }))
}

module.exports.busca_item = function(application, req, res){
  const itemsModel = require("../models/items")
  itemsModel.getItem([req.params.item_id]).then(dados => redirecionaItem(dados, res))//.then(dados => res.render("items/item", { items: dados }))
}

module.exports.busca_todos = function (application, req, res) {
  const itemsModel = require("../models/items")
  itemsModel.getItems().then(dados => {return res.send(dados)})
}

function redirecionaItem(dados, res){
  if(dados[0]){
    res.render("items/item", { items: dados })
  }else{
    res.render("home/home")
  }
  
}