const mage = require("../../config/conexao_mage")
const Adress = require("../models/address")
const Items = require("../models/items")
const Payment = require("../models/payment")

const client = mage.client


async function getOrders() {
    try {
        let dados = client.get('orders')
        return dados
    } catch (err) {

    }
}

async function getItem(id) {
    try {
        let dados = Items.getItem(id)
        return dados
    } catch (err) {
        console.log(err)
    }
}

async function getAdress(id) {
    try {
        let dados = Adress.getAddress(id)
        return dados
    } catch (err) {
        console.log(err)
    }
}

async function getPag(id) {
    try {
        let dados = Payment.getPayment(id)
        return dados
    } catch (err) {
        console.log(err)
    }
}

function getDados(dados) {
    let x = 0;
    while (dados['total_count'] > x) {
        const Address = dados['items'][x].billing_address
        const Item = dados['items'][x].items[0]
        const Pagamento = dados['items'][x].payment

        getItem(Item.order_id).then(valor => roda(valor, 'item'))
        getAdress(Address.entity_id).then(valor => roda(valor, 'end'))
        getPag(Pagamento.entity_id).then(valor => roda(valor, 'pag'))

        function roda(value, tab) {

            if (value.length != 0) {
                switch (tab) {
                    case 'item':
                        const id_item = value[0].dataValues
                        Items.updateItems(Item, id_item.id)
                        break
                    case 'end':
                        const id_end = value[0].dataValues
                        Adress.updateAddress(Address, id_end.id)
                        break
                    case 'pag':
                        const id_pag = value[0].dataValues
                        Payment.updatePayment(Pagamento, id_pag.id)
                        break
                }
            } else {
                Adress.createAddress(Address);
                Items.createItems(Item)
                Payment.createPayment(Pagamento)
            }
        }
        x++
    }
    return dados
}

/*setInterval(function () {
    getOrders().then(data => data.data).then(dados => getDados(dados))
}, 90000)
*/
/** 900000 = 15 minutos**/