const itemsModel = require("../models/items")
class Pedidos {
    constructor() {

    }
    home(application, req, res) {
        itemsModel.getItems().then(dados => {
            dados.forEach(element => {
                let data = element.dataValues.created_at
                let dataFormatada = ((data.getDate() ) + "-" + ((data.getMonth() + 1)) + "-" + data.getFullYear())
                element.dataValues.created_at = dataFormatada

                data = element.dataValues.updated_at
                dataFormatada = ((data.getDate() ) + "-" + ((data.getMonth() + 1)) + "-" + data.getFullYear())
                element.dataValues.updated_at = dataFormatada
            });
            res.render("pedidos/pedidos", { pedidos: dados })
        })
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