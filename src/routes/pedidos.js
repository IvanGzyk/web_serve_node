const Pedidos = require('../controllers/Pedidos')
var pedidos = Pedidos.Pedidos

module.exports = function (application) {

    application.get("/pedidos", (req, res) => {
        pedidos.home(application, req, res)
    })

    application.get("/pedidos/:item_id", (req, res) => {
        pedidos.items.busca_item(application, req, res)
    })

    application.get("/buscaPedidos", (req, res) => {
        pedidos.busca_todos(application, req, res)
    })
}