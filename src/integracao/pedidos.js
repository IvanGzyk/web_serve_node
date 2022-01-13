const mage = require("../../config/conexao_mage")
const Adress = require("../models/address")
const Items = require("../models/items")
const Payment = require("../models/payment")
const Orders = require("../models/orders")
const funcoes = require('../util/Util').Util
const CronJob = require('cron').CronJob


const client = mage.client

async function getOrders(params) {
    try {
        let dados = client.get('orders', params)
        return dados
    } catch (err) {
        console.log(err.response.data.message)
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
        //console.log(err)
    }
}

async function getPedidos(id) {
    try {
        let dados = Orders.getOreder(id)
        return dados
    } catch (err) {
        console.log(err)
    }
}

function getDados(dados) {

    const Pedidos = dados['items']
    if (Pedidos.length > 0) {
        Pedidos.forEach(element => {

            getPedidos(element.entity_id).then(dados => {
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
                getItem(item.order_id).then(dados => {
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
            //console.log(End.entity_id)
            getAdress(End.entity_id).then(dados => {
                console.log(dados.length)
                if (dados.length != 0) {
                    dados.forEach(array => {
                        Adress.updateAddress(End, dados.entity_id)
                    })
                } else if (dados.length == 0){
                    dados.forEach(array => {
                        Adress.createAddress(End)
                    })
                }
            })

            /*getPedidos(element.entity_id).then(dados => {

                if (dados.length > 0) {
                    dados.forEach(array => {
                        Orders.updateOreder(element, array.dataValues.id)
                    })
                } else {
                    Orders.createOreder(element)
                }
            })*/
        })
    }

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

// const job = new CronJob('0 15 * * * *', () => {

//     data_atual = funcoes.dataAtual()
//     data_inicio = funcoes.dataDeInicio(-30)

//     let params = {
//         $from: data_inicio,
//         $to: data_atual,
//         $sort: {
//             "created_at": "desc"
//         },
//         $perPage: 200,
//         $page: 1
//     }
//     getOrders(params).then(data => data.data).then(dados => getDados(dados))
//     console.log('Pedidos atualizado em: ' + data_atual)
// }, null, true, 'America/Sao_Paulo')

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}
// const teste = new CronJob('*/15 * * * * *', () => {
//     data_atual = funcoes.dataAtual()
//     data_inicio = funcoes.dataDeInicio(-30)

//     let params = {
//         $from: data_inicio,
//         $to: data_atual,
//         $sort: {
//             "created_at": "desc"
//         },
//         $perPage: 200,
//         $page: 1
//     }
//     getOrders(params).then(data => data.data).then(data => data.items).then(console.log)
// }, null, true, 'America/Sao_Paulo')