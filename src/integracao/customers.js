const mage = require("../../config/conexao_mage")
const Customers = require('../models/customers')
const Addres = require('../models/address')
const funcoes = require('../util/Util').Util
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

const getshippingAddress = async function (customer_id) {
    try {
        let dados = await client.get(`customers/${customer_id}/shippingAddress`)
        return dados
    } catch (err) {
        console.log(err)
    }
}

function salvaAddress(dados) {
    if (dados.id != undefined) {
        var Address = new Object()
        Address.id = dados.id
        Address.customer_id = dados.customer_id
        Address.region = dados.region
        Address.region_id = dados.region_id
        Address.country_id = dados.country_id
        Address.street = dados.street
        Address.company = dados.company
        Address.telephone = dados.telephone
        Address.fax = dados.fax
        Address.postcode = dados.postcode
        Address.city = dados.city
        Address.firstname = dados.firstname
        Address.lastname = dados.lastname
        Address.middlename = dados.middlename
        Address.prefix = dados.prefix
        Address.suffix = dados.suffix
        Address.vat_id = dados.vat_id
        Address.default_shipping = dados.default_shipping
        Address.default_billing = dados.default_billing
        Address.extension_attributes = dados.extension_attributes
        Address.custom_attributes = dados.custom_attributes

        Addres.getAddress(dados.id).then(ret => {
            if (ret.length == 0) {
                Addres.createAddress(Address)
            } else if (ret.length == 1) {
                Addres.updateAddress(Address, dados.id)
            }
        })
    }
}

function salvaCustomers(dados) {

    const retorno = dados.items
    retorno.forEach(element => {
        var cliente = new Object()
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

        Customers.getCustomer(element.id).then(ret => {
            if (ret.length == 0) {
                Customers.createCustomer(cliente)
            } else if (ret.length == 1) {
                Customers.updateCustomer(cliente, element.id)
            }
        })
        getshippingAddress(element.id).then(dados => dados.data).then(dados => salvaAddress(dados))
    })
}

// const job = new CronJob('0 20 * * * *', () => {
    
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
//     getCustomers(params).then(data => data.data).then(items => salvaCustomers(items))
//     console.log('Clientes atualizado em: '+data_atual)
// }, null, true, 'America/Sao_Paulo')

module.exports = { client, getCustomers, getCustomer, postCustomer, putCustomer, deleteCustomer }