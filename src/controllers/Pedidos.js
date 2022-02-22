const itemsModel = require("../models/items")
const IntegracaoPedidos = require('../integracao/pedidos')
const Orders = require("../models/orders")
const Adress = require("../models/address")
const Items = require("../models/items")
const Payment = require("../models/payment")
class Pedidos {
    constructor() {

    }
    home(application, req, res) {
        itemsModel.getItems().then(dados => {
            dados.forEach(element => {
                let data = element.dataValues.created_at
                let dataFormatada = ((data.getDate()) + "-" + ((data.getMonth() + 1)) + "-" + data.getFullYear())
                element.dataValues.created_at = dataFormatada

                data = element.dataValues.updated_at
                dataFormatada = ((data.getDate()) + "-" + ((data.getMonth() + 1)) + "-" + data.getFullYear())
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

    getDados(dados) {
        const Pedidos = dados['items']
        if (Pedidos.length > 0) {
            Pedidos.forEach(element => {
    
                IntegracaoPedidos.getPedidos(element.entity_id).then(dados => {
                    if (dados.length > 0) {
                        dados.forEach(array => {
                            Orders.updateOreder(element, array.dataValues.id)
                        })
                    } else {
                        Orders.createOreder(element)
                    }
                })
    
                const items = element.items
                items.forEach(item => {
                    IntegracaoPedidos.getItem(item.order_id).then(dados => {
                        if (dados.length > 0) {
                            dados.forEach(array => {
                                Items.updateItems(item, array.id)
                            })
                        } else {
                            dados.forEach(array => {
                                Items.createItems(item)
                            })
                        }
                    })
                })
    
                const End = element.billing_address
                IntegracaoPedidos.getAdress(End.entity_id).then(dados => {
                    if (dados.length != 0) {
                        dados.forEach(array => {
                            Adress.updateAddress(End, dados.entity_id)
                        })
                    } else if (dados.length == 0) {
                        dados.forEach(array => {
                            Adress.createAddress(End)
                        })
                    }
                })
            })
        }
    
        let x = 0;
        while (dados['total_count'] > x) {
            const Address = dados['items'][x].billing_address
            const Item = dados['items'][x].items[0]
            const Pagamento = dados['items'][x].payment
    
            IntegracaoPedidos.getItem(Item.order_id).then(valor => roda(valor, 'item'))
            IntegracaoPedidos.getAdress(Address.entity_id).then(valor => roda(valor, 'end'))
            IntegracaoPedidos.getPag(Pagamento.entity_id).then(valor => roda(valor, 'pag'))
    
            function roda(value, tab) {
    
                if (value.length != 0) {
                    switch (tab) {
                        case 'item':
                            const id_item = value[0].dataValues
                            Items.updateItems(Item, id_item.id)
                            break
                        case 'end':
                            const id_end = value[0].dataValues
                            if (id_end.id != undefined) {
                                Adress.updateAddress(Address, id_end.id)
                            }
                            break
                        case 'pag':
                            const id_pag = value[0].dataValues
                            Payment.updatePayment(Pagamento, id_pag.id)
                            break
                    }
                } else {
                    if (Address.id != undefined) {
                        Adress.createAddress(Address)
                    }
                    Items.createItems(Item)
                    Payment.createPayment(Pagamento)
                }
            }
            x++
        }
        return dados
    }
}

module.exports.Pedidos = new Pedidos()