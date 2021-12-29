const itemsModel = require("../models/items")
class Pedidos {
    constructor() {

    }
    home(application, req, res) {
        itemsModel.getItems().then(dados => res.render("items/index", { items: dados }))
    }

    busca_item(application, req, res) {
        itemsModel.getItem([req.params.item_id]).then(dados => this.redirecionaItem(dados, res))
    }

    busca_todos(application, req, res) {
        itemsModel.getItems().then(dados => { return res.send(dados) })
    }

    redirecionaItem(dados, res) {
        if (dados[0]) {
            res.render("items/item", { items: dados })
        } else {
            res.render("home/home")
        }

    }
}

module.exports.Pedidos = new Pedidos()