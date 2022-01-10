const mage = require("../../config/conexao_mage")
const Customers = require('../models/customers')
const CronJob = require('cron').CronJob

const client = mage.client

const getCustomers = async function (params) {

    try {
        let dados = await client.get('customers/search', params)
        return dados
    } catch (err) {
        console.log(err)
    }
}

const getCustomer = async function (codigo) {
    try {
        let dados = await client.get('customers', { sku: codigo })
        return dados
    } catch (err) {
        console.log(err)
    }
}

const postCustomer = async function (json) {
    try {
        let dados = await client.post('customers', json)
        return dados
    } catch (err) {
        console.log(err.response.data.message)
    }
}

const putCustomer = async function (sku, json) {
    try {
        let dados = await client.put(`customers/${sku}`, json)
        return dados
    } catch (err) {
        console.log(err.response.data.message)
    }
}

const deleteCustomer = async function (sku) {
    try {
        let dados = await client.delete(`customers/${sku}`)
        return dados
    } catch (err) {
        console.log(err.response.data.message)
    }
}

function salvaCustomers(dados){

    const retorno = dados.items
    retorno.forEach(element => {
        var cliente = new Object();
        cliente.id = element.id
        cliente.group_id = element.group_id
        cliente.default_billing = element.default_billing
        cliente.default_shipping = element.default_shipping
        cliente.confirmation = element.confirmation
        cliente.created_at = element.created_at
        cliente.updated_at = element.updated_at
        cliente.created_in = element.created_in
        cliente.dob = element.dob
        cliente.email = element.email
        cliente.firstname = element.firstname
        cliente.lastname = element.lastname
        cliente.middlename = element.middlename
        cliente.prefix = element.prefix
        cliente.suffix = element.suffix
        cliente.gender = element.gender
        cliente.store_id = element.store_id
        cliente.taxvat = element.taxvat

        Customers.getCustomer(element.id).then(ret => salva(ret))
        function salva(ret){
            if (ret.length == 0){
                Customers.createCustomer(cliente)
            }else if (ret.length == 1) {
                Customers.updateCustomer(cliente, element.id)
            }
        }
    })
}

const job = new CronJob('0 * * * * *', () => {
    
    var data = new Date()
    data = addMinutes(data, +180)
    var dataIni = addMinutes(data, -30)

    var dia = String(data.getDate()).padStart(2, '0')
    var diaIni = String(dataIni.getDate()).padStart(2, '0')
    var mes = String(data.getMonth() + (1)).padStart(2, '0')
    var mesIni = String(dataIni.getMonth() + (1)).padStart(2, '0')
    var ano = data.getFullYear()
    var anoIni = dataIni.getFullYear()
    var hora = String(data.getHours()).padStart(2, '0')
    var horaIni = String(dataIni.getHours()).padStart(2, '0')
    var minuto = String(data.getMinutes()).padStart(2, '0')
    var minutoIni = String(dataIni.getMinutes()).padStart(2, '0')
    var segundos = String(data.getSeconds()).padStart(2, '0')
    var segundosIni = String(dataIni.getSeconds()).padStart(2, '0')

    data_atual = ano+'-'+mes+'-'+dia+' '+hora+':'+minuto+':'+segundos
    data_inicio = anoIni+'-'+mesIni+'-'+diaIni+' '+horaIni+':'+minutoIni+':'+segundosIni

    let params = {
        $from: data_inicio,
        $to: data_atual,
        $sort: {
            "created_at": "desc"
        },
        $perPage: 200,
        $page: 1
    }
    getCustomers(params).then(data => data.data).then(items => salvaCustomers(items))
    console.log(data_atual +' - '+data_inicio)
}, null, true, 'America/Sao_Paulo')

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

module.exports = { client, getCustomers, getCustomer, postCustomer, putCustomer, deleteCustomer}