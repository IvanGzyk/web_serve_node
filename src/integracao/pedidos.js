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
        console.log(err)
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

module.exports = {
    client,
    getOrders,
    getItem,
    getAdress,
    getPag,
    getPedidos
}